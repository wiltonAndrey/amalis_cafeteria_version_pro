<?php

require __DIR__ . '/../bootstrap.php';

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
  "INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$insertProduct->execute([
  $prefix . '-base',
  3.50,
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
  'name' => 'Producto Modificado',
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

$cleanupProduct = $pdo->prepare('DELETE FROM menu_products WHERE id = ?');
$cleanupProduct->execute([$productId]);
$cleanupCategory = $pdo->prepare('DELETE FROM menu_categories WHERE id = ?');
$cleanupCategory->execute([$categoryId]);

echo "PASS\n";
