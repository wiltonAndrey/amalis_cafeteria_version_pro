<?php

require __DIR__ . '/../bootstrap.php';

function fail_with_cleanup(PDO $pdo, string $categoryId, ?int $productId, string $message): void
{
  if ($productId !== null) {
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
$productId = null;

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
  fail_with_cleanup($pdo, $categoryId, null, 'missing id');
}

$productId = (int) $data['id'];

$cleanupProduct = $pdo->prepare('DELETE FROM menu_products WHERE id = ?');
$cleanupProduct->execute([$productId]);
$cleanupCategory = $pdo->prepare('DELETE FROM menu_categories WHERE id = ?');
$cleanupCategory->execute([$categoryId]);

echo "PASS\n";
