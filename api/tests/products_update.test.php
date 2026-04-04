<?php

require __DIR__ . '/../bootstrap.php';
ob_start();
require __DIR__ . '/../update_schema_price_unit.php';
ob_end_clean();

function fail_with_cleanup(PDO $pdo, string $categoryId, int $productId, string $message): void
{
  $cleanupProduct = $pdo->prepare('DELETE FROM menu_products WHERE id = ?');
  $cleanupProduct->execute([$productId]);
  $cleanupCategory = $pdo->prepare('DELETE FROM menu_categories WHERE id = ?');
  $cleanupCategory->execute([$categoryId]);
  fwrite(STDERR, "FAIL: $message\n");
  exit(1);
}

$pdo = get_pdo();
$prefix = 'update-test-' . bin2hex(random_bytes(4));
$categoryId = $prefix . '-cat';

$insertCategory = $pdo->prepare(
  'INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)'
);
$insertCategory->execute([$categoryId, 'Categoria temporal update', 9991]);

$insertProduct = $pdo->prepare(
  "INSERT INTO menu_products (name, price, price_unit, category, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$insertProduct->execute([
  $prefix . '-base',
  3.50,
  'unit',
  $categoryId,
  'Descripcion base',
  '/images/sections/editada-01.webp',
  json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
  json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
  0,
  1,
  1,
]);
$productId = (int) $pdo->lastInsertId();

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$_SESSION['admin_id'] = 1;

$_POST = [
  'id' => $productId,
  'price_unit' => 'box',
];

ob_start();
require __DIR__ . '/../products/update.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (($data['error'] ?? null) !== 'invalid_price_unit') {
  fail_with_cleanup($pdo, $categoryId, $productId, 'update did not validate invalid price_unit');
}

$_POST = [
  'id' => $productId,
  'name' => 'Producto sin tocar unidad',
];

ob_start();
require __DIR__ . '/../products/update.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['ok'])) {
  $error = is_array($data) ? ($data['error'] ?? 'unknown_error') : 'invalid_json';
  fail_with_cleanup($pdo, $categoryId, $productId, "update with omitted price_unit failed ($error)");
}

$_POST = [
  'id' => $productId,
  'name' => 'Producto unidad null',
  'price_unit' => null,
];

ob_start();
require __DIR__ . '/../products/update.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['ok'])) {
  $error = is_array($data) ? ($data['error'] ?? 'unknown_error') : 'invalid_json';
  fail_with_cleanup($pdo, $categoryId, $productId, "update with null price_unit failed ($error)");
}

$_POST = [
  'id' => $productId,
  'name' => 'Producto unidad blank',
  'price_unit' => '',
];

ob_start();
require __DIR__ . '/../products/update.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['ok'])) {
  $error = is_array($data) ? ($data['error'] ?? 'unknown_error') : 'invalid_json';
  fail_with_cleanup($pdo, $categoryId, $productId, "update with blank price_unit failed ($error)");
}

$preservedRow = $pdo->prepare('SELECT name, price_unit FROM menu_products WHERE id = ? LIMIT 1');
$preservedRow->execute([$productId]);
$preservedProduct = $preservedRow->fetch();

if (!$preservedProduct || ($preservedProduct['price_unit'] ?? null) !== 'unit') {
  fail_with_cleanup($pdo, $categoryId, $productId, 'update changed price_unit when it was omitted, null, or blank');
}

$_POST = [
  'id' => $productId,
  'name' => 'Producto Modificado',
  'price_unit' => 'kg',
  'image' => '/images/uploads/producto-modificado.webp',
  'alt_text' => 'Producto modificado para SEO',
  'image_title' => 'Producto Modificado',
];

ob_start();
require __DIR__ . '/../products/update.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['ok'])) {
  $error = is_array($data) ? ($data['error'] ?? 'unknown_error') : 'invalid_json';
  fail_with_cleanup($pdo, $categoryId, $productId, "update failed ($error)");
}

$updatedRow = $pdo->prepare('SELECT name, price_unit, image, alt_text, image_title FROM menu_products WHERE id = ? LIMIT 1');
$updatedRow->execute([$productId]);
$updatedProduct = $updatedRow->fetch();

if (!$updatedProduct || ($updatedProduct['price_unit'] ?? null) !== 'kg') {
  fail_with_cleanup($pdo, $categoryId, $productId, 'update did not persist kg price_unit');
}

$cleanupProduct = $pdo->prepare('DELETE FROM menu_products WHERE id = ?');
$cleanupProduct->execute([$productId]);
$cleanupCategory = $pdo->prepare('DELETE FROM menu_categories WHERE id = ?');
$cleanupCategory->execute([$categoryId]);

echo "PASS\n";
