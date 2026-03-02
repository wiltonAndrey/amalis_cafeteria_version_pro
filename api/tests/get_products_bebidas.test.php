<?php
require __DIR__ . '/../bootstrap.php';

ob_start();
require __DIR__ . '/../update_schema_menu_taxonomy.php';
ob_end_clean();

$pdo = get_pdo();

$pdo->exec("INSERT IGNORE INTO menu_categories (id, label, sort_order) VALUES ('bebidas', 'Bebidas', 999)");

$name = 'Cafe Solo Test ' . substr(uniqid('', true), -6);
$stmt = $pdo->prepare(
  "INSERT INTO menu_products (name, price, category, subcategory, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([
  $name,
  1.40,
  'bebidas',
  'cafes',
  'Cafe de prueba para serializacion de subcategoria',
  '/images/products/cafe-solo.webp',
  json_encode(['Cafe'], JSON_UNESCAPED_UNICODE),
  json_encode([], JSON_UNESCAPED_UNICODE),
  0,
  1,
  99999,
]);

ob_start();
require __DIR__ . '/../get_products.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (!is_array($data)) {
  fwrite(STDERR, "FAIL: invalid JSON\n");
  exit(1);
}

$categories = is_array($data['menuCategories'] ?? null) ? $data['menuCategories'] : [];
$hasBebidas = false;
foreach ($categories as $category) {
  if (($category['id'] ?? '') === 'bebidas') {
    $hasBebidas = true;
    break;
  }
}

if (!$hasBebidas) {
  fwrite(STDERR, "FAIL: bebidas category not found in API response\n");
  exit(1);
}

$products = is_array($data['menuProducts'] ?? null) ? $data['menuProducts'] : [];
$target = null;
foreach ($products as $product) {
  if (($product['name'] ?? '') === $name) {
    $target = $product;
    break;
  }
}

if (!$target) {
  fwrite(STDERR, "FAIL: inserted bebidas product not found in API response\n");
  exit(1);
}

if (($target['category'] ?? '') !== 'bebidas') {
  fwrite(STDERR, "FAIL: category was not serialized as bebidas\n");
  exit(1);
}

if (($target['subcategory'] ?? '') !== 'cafes') {
  fwrite(STDERR, "FAIL: subcategory was not serialized as cafes\n");
  exit(1);
}

echo "PASS\n";
