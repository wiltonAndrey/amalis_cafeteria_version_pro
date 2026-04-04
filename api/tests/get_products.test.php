<?php
require __DIR__ . '/../bootstrap.php';
ob_start();
require __DIR__ . '/../update_schema_price_unit.php';
ob_end_clean();

$pdo = get_pdo();
$prefix = 'gpu-' . bin2hex(random_bytes(4));
$categoryId = $prefix . '-cat';

$insertCategory = $pdo->prepare(
  'INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)'
);
$insertCategory->execute([$categoryId, 'Categoria temporal get_products', 9989]);

$insertProduct = $pdo->prepare(
  'INSERT INTO menu_products (name, price, price_unit, category, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$insertProduct->execute([
  $prefix . '-bizcocho',
  26.00,
  'kg',
  $categoryId,
  'Descripcion temporal',
  '/images/sections/editada-01.webp',
  json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
  json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
  0,
  1,
  1,
]);
$productId = (int) $pdo->lastInsertId();

ob_start();
require __DIR__ . '/../get_products.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data)) {
  fwrite(STDERR, "FAIL: invalid JSON\n");
  exit(1);
}

if (empty($data['menuCategories']) || empty($data['menuProducts'])) {
  fwrite(STDERR, "FAIL: missing menu data\n");
  exit(1);
}

if (empty($data['featuredProducts'])) {
  fwrite(STDERR, "FAIL: missing featured products\n");
  exit(1);
}

if (empty($data['promotionCards'])) {
  $pdo->prepare('DELETE FROM menu_products WHERE id = ?')->execute([$productId]);
  $pdo->prepare('DELETE FROM menu_categories WHERE id = ?')->execute([$categoryId]);
  fwrite(STDERR, "FAIL: missing promotion cards\n");
  exit(1);
}

$matchedProduct = null;
foreach ($data['menuProducts'] as $menuProduct) {
  if (($menuProduct['id'] ?? '') === (string) $productId) {
    $matchedProduct = $menuProduct;
    break;
  }
}

$pdo->prepare('DELETE FROM menu_products WHERE id = ?')->execute([$productId]);
$pdo->prepare('DELETE FROM menu_categories WHERE id = ?')->execute([$categoryId]);

if (!$matchedProduct) {
  fwrite(STDERR, "FAIL: temporary product not returned\n");
  exit(1);
}

if (!array_key_exists('price_unit', $matchedProduct) || $matchedProduct['price_unit'] !== 'kg') {
  fwrite(STDERR, "FAIL: missing or invalid price_unit in get_products response\n");
  exit(1);
}

echo "PASS\n";
