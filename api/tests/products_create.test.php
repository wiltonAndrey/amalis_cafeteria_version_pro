<?php

require __DIR__ . '/../bootstrap.php';
ob_start();
require __DIR__ . '/../update_schema_price_unit.php';
ob_end_clean();

function fail_with_cleanup(PDO $pdo, string $categoryId, array $productIds, string $message): void
{
  foreach ($productIds as $productId) {
    $cleanupProduct = $pdo->prepare('DELETE FROM menu_products WHERE id = ?');
    $cleanupProduct->execute([$productId]);
  }

  $cleanupCategory = $pdo->prepare('DELETE FROM menu_categories WHERE id = ?');
  $cleanupCategory->execute([$categoryId]);

  fwrite(STDERR, "FAIL: $message\n");
  exit(1);
}

$pdo = get_pdo();
$prefix = 'create-test-' . bin2hex(random_bytes(4));
$categoryId = $prefix . '-cat';
$productIds = [];

$insertCategory = $pdo->prepare(
  'INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)'
);
$insertCategory->execute([$categoryId, 'Categoria temporal create', 9990]);

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$_SESSION['admin_id'] = 1;

$_POST = [
  'name' => $prefix . '-product',
  'price' => 10.50,
  'price_unit' => 'kg',
  'category' => $categoryId,
  'description' => 'Desc',
  'ingredients' => ['Harina'],
  'allergens' => ['Gluten'],
  'image' => '/images/sections/editada-01.webp',
];

ob_start();
require __DIR__ . '/../products/create.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['id'])) {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'missing id for kg product');
}

$productIds[] = (int) $data['id'];

$createdRow = $pdo->prepare('SELECT price_unit FROM menu_products WHERE id = ? LIMIT 1');
$createdRow->execute([$productIds[0]]);
$createdProduct = $createdRow->fetch();

if (!$createdProduct || ($createdProduct['price_unit'] ?? null) !== 'kg') {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'create did not persist kg price_unit');
}

$_POST = [
  'name' => $prefix . '-product-default-unit',
  'price' => 4.25,
  'category' => $categoryId,
  'description' => 'Desc unit',
  'ingredients' => ['Harina'],
  'allergens' => ['Gluten'],
  'image' => '/images/sections/editada-01.webp',
];

ob_start();
require __DIR__ . '/../products/create.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['id'])) {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'missing id for default unit product');
}

$productIds[] = (int) $data['id'];

$createdRow->execute([$productIds[1]]);
$createdProduct = $createdRow->fetch();

if (!$createdProduct || array_key_exists('price_unit', $createdProduct) === false || $createdProduct['price_unit'] !== null) {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'create fabricated canonical price_unit when omitted');
}

$_POST = [
  'name' => $prefix . '-product-explicit-null-unit',
  'price' => 5.25,
  'price_unit' => null,
  'category' => $categoryId,
  'description' => 'Desc null unit',
  'ingredients' => ['Harina'],
  'allergens' => ['Gluten'],
  'image' => '/images/sections/editada-01.webp',
];

ob_start();
require __DIR__ . '/../products/create.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['id'])) {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'missing id for explicit null price_unit product');
}

$productIds[] = (int) $data['id'];

$createdRow->execute([$productIds[2]]);
$createdProduct = $createdRow->fetch();

if (!$createdProduct || array_key_exists('price_unit', $createdProduct) === false || $createdProduct['price_unit'] !== null) {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'create did not preserve null price_unit safely');
}

$_POST = [
  'name' => $prefix . '-product-invalid-unit',
  'price' => 5.10,
  'price_unit' => 'box',
  'category' => $categoryId,
  'description' => 'Desc invalid',
  'ingredients' => ['Harina'],
  'allergens' => ['Gluten'],
  'image' => '/images/sections/editada-01.webp',
];

ob_start();
require __DIR__ . '/../products/create.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (($data['error'] ?? null) !== 'invalid_price_unit') {
  fail_with_cleanup($pdo, $categoryId, $productIds, 'create did not validate invalid price_unit');
}

$cleanupProduct = $pdo->prepare('DELETE FROM menu_products WHERE id = ?');
foreach ($productIds as $productId) {
  $cleanupProduct->execute([$productId]);
}
$cleanupCategory = $pdo->prepare('DELETE FROM menu_categories WHERE id = ?');
$cleanupCategory->execute([$categoryId]);

echo "PASS\n";
