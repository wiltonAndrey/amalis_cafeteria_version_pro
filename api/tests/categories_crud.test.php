<?php

ob_start();
require __DIR__ . '/../update_schema_menu_taxonomy.php';
ob_end_clean();

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$_SESSION['admin_id'] = 1;

$pdo = get_pdo();

$suffix = bin2hex(random_bytes(4));
$slugA = 'cat_test_' . $suffix . '_a';
$slugB = 'cat_test_' . $suffix . '_b';
$slugARenamed = 'cat_test_' . $suffix . '_renamed';
$labelA = 'Categoria Test ' . $suffix . ' A';
$labelB = 'Categoria Test ' . $suffix . ' B';
$labelARenamed = 'Categoria Test ' . $suffix . ' Renombrada';

$cleanup = $pdo->prepare('DELETE FROM menu_products WHERE category IN (?, ?, ?)');
$cleanup->execute([$slugA, $slugB, $slugARenamed]);
$cleanupCategories = $pdo->prepare('DELETE FROM menu_categories WHERE id IN (?, ?, ?)');
$cleanupCategories->execute([$slugA, $slugB, $slugARenamed]);

$_POST = [
  'label' => $labelA,
  'slug' => $slugA,
  'sort_order' => 1200,
  'active' => 1,
  'visible_in_menu' => 1,
];

ob_start();
require __DIR__ . '/../categories/create.php';
$createJson = ob_get_clean();
$createData = json_decode($createJson, true);

if (empty($createData['ok'])) {
  $error = is_array($createData) ? ($createData['error'] ?? 'unknown_error') : 'invalid_json';
  fwrite(STDERR, "FAIL: category create failed ($error)\n");
  exit(1);
}

$created = $pdo->prepare('SELECT id, label, sort_order, active, visible_in_menu FROM menu_categories WHERE id = ? LIMIT 1');
$created->execute([$slugA]);
$row = $created->fetch();

if (!$row) {
  fwrite(STDERR, "FAIL: created category not found in DB\n");
  exit(1);
}

if (($row['label'] ?? '') !== $labelA) {
  fwrite(STDERR, "FAIL: category label mismatch after create\n");
  exit(1);
}

if ((int) ($row['sort_order'] ?? -1) !== 1200) {
  fwrite(STDERR, "FAIL: category sort_order mismatch after create\n");
  exit(1);
}

$_POST = [
  'label' => $labelA . ' duplicada',
  'slug' => $slugA,
];

ob_start();
require __DIR__ . '/../categories/create.php';
$duplicateSlugJson = ob_get_clean();
$duplicateSlugData = json_decode($duplicateSlugJson, true);

if (($duplicateSlugData['error'] ?? '') !== 'duplicate_slug') {
  fwrite(STDERR, "FAIL: expected duplicate_slug validation\n");
  exit(1);
}

$_POST = [
  'label' => $labelA,
  'slug' => $slugB,
];

ob_start();
require __DIR__ . '/../categories/create.php';
$duplicateLabelJson = ob_get_clean();
$duplicateLabelData = json_decode($duplicateLabelJson, true);

if (($duplicateLabelData['error'] ?? '') !== 'duplicate_label') {
  fwrite(STDERR, "FAIL: expected duplicate_label validation\n");
  exit(1);
}

$_POST = [
  'label' => $labelB,
  'slug' => $slugB,
  'sort_order' => 1300,
  'active' => 1,
  'visible_in_menu' => 1,
];

ob_start();
require __DIR__ . '/../categories/create.php';
$createBJson = ob_get_clean();
$createBData = json_decode($createBJson, true);

if (empty($createBData['ok'])) {
  fwrite(STDERR, "FAIL: second category create failed\n");
  exit(1);
}

ob_start();
require __DIR__ . '/../categories/list.php';
$listJson = ob_get_clean();
$listData = json_decode($listJson, true);

if (empty($listData['ok']) || !is_array($listData['categories'] ?? null)) {
  fwrite(STDERR, "FAIL: category list endpoint failed\n");
  exit(1);
}

$listedIds = array_map(static fn ($item) => (string) ($item['id'] ?? ''), $listData['categories']);
if (!in_array($slugA, $listedIds, true) || !in_array($slugB, $listedIds, true)) {
  fwrite(STDERR, "FAIL: created categories not present in category list endpoint\n");
  exit(1);
}

$pdo->prepare(
  "INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (?, ?, ?, ?, ?, JSON_ARRAY('Test'), JSON_ARRAY('Ninguno'), 0, 1, 9998)"
)->execute([
  'Producto Categoria Test ' . $suffix,
  1.99,
  $slugA,
  'Producto para probar rename de categoria',
  '/images/sections/editada-01.webp',
]);

$_POST = [
  'id' => $slugA,
  'slug' => $slugARenamed,
  'label' => $labelARenamed,
  'active' => 0,
  'visible_in_menu' => 0,
  'sort_order' => 1400,
];

ob_start();
require __DIR__ . '/../categories/update.php';
$updateJson = ob_get_clean();
$updateData = json_decode($updateJson, true);

if (empty($updateData['ok'])) {
  $error = is_array($updateData) ? ($updateData['error'] ?? 'unknown_error') : 'invalid_json';
  fwrite(STDERR, "FAIL: category update failed ($error)\n");
  exit(1);
}

$renamedCategory = $pdo->prepare('SELECT id, label, active, visible_in_menu, sort_order FROM menu_categories WHERE id = ? LIMIT 1');
$renamedCategory->execute([$slugARenamed]);
$renamedRow = $renamedCategory->fetch();

if (!$renamedRow) {
  fwrite(STDERR, "FAIL: renamed category not found\n");
  exit(1);
}

if (($renamedRow['label'] ?? '') !== $labelARenamed) {
  fwrite(STDERR, "FAIL: renamed category label not updated\n");
  exit(1);
}

if ((int) ($renamedRow['active'] ?? 1) !== 0 || (int) ($renamedRow['visible_in_menu'] ?? 1) !== 0) {
  fwrite(STDERR, "FAIL: category active/visible flags not updated\n");
  exit(1);
}

$productCategory = $pdo->prepare('SELECT category FROM menu_products WHERE name = ? ORDER BY id DESC LIMIT 1');
$productCategory->execute(['Producto Categoria Test ' . $suffix]);
$productCategoryValue = (string) $productCategory->fetchColumn();
if ($productCategoryValue !== $slugARenamed) {
  fwrite(STDERR, "FAIL: product category was not migrated on slug rename\n");
  exit(1);
}

$_POST = [
  'items' => [
    ['id' => $slugB, 'sort_order' => 10],
    ['id' => $slugARenamed, 'sort_order' => 20],
  ],
];

ob_start();
require __DIR__ . '/../categories/reorder.php';
$reorderJson = ob_get_clean();
$reorderData = json_decode($reorderJson, true);

if (empty($reorderData['ok'])) {
  $error = is_array($reorderData) ? ($reorderData['error'] ?? 'unknown_error') : 'invalid_json';
  fwrite(STDERR, "FAIL: category reorder failed ($error)\n");
  exit(1);
}

$sorted = $pdo->query(
  "SELECT id, sort_order
   FROM menu_categories
   WHERE id IN ('{$slugB}', '{$slugARenamed}')
   ORDER BY sort_order ASC, id ASC"
)->fetchAll();

if (($sorted[0]['id'] ?? '') !== $slugB || (int) ($sorted[0]['sort_order'] ?? -1) !== 10) {
  fwrite(STDERR, "FAIL: first category reorder result incorrect\n");
  exit(1);
}

if (($sorted[1]['id'] ?? '') !== $slugARenamed || (int) ($sorted[1]['sort_order'] ?? -1) !== 20) {
  fwrite(STDERR, "FAIL: second category reorder result incorrect\n");
  exit(1);
}

$cleanup->execute([$slugA, $slugB, $slugARenamed]);
$cleanupCategories->execute([$slugA, $slugB, $slugARenamed]);

echo "PASS\n";
