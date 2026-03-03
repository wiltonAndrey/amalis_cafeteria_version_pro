<?php

require __DIR__ . '/../bootstrap.php';

function fail_with_cleanup(PDO $pdo, string $prefix, string $message): void
{
  $cleanup = $pdo->prepare('DELETE FROM menu_products WHERE name LIKE ?');
  $cleanup->execute([$prefix . '%']);
  $cleanupCategories = $pdo->prepare('DELETE FROM menu_categories WHERE id LIKE ?');
  $cleanupCategories->execute([$prefix . '%']);
  fwrite(STDERR, "FAIL: $message\n");
  exit(1);
}

$pdo = get_pdo();
$prefix = 'sort-scope-' . bin2hex(random_bytes(4));
$toastCategory = $prefix . '-cat-a';
$drinkCategory = $prefix . '-cat-b';

$insertCategory = $pdo->prepare(
  'INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)'
);
$insertCategory->execute([$toastCategory, 'Categoria temporal A', 9990]);
$insertCategory->execute([$drinkCategory, 'Categoria temporal B', 9991]);

$insert = $pdo->prepare(
  "INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$insert->execute([
  $prefix . '-tostada-1',
  2.10,
  $toastCategory,
  'Producto de prueba 1',
  '/images/sections/editada-01.webp',
  json_encode(['Pan'], JSON_UNESCAPED_UNICODE),
  json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
  0,
  1,
  1,
]);
$toastOneId = (int) $pdo->lastInsertId();

$insert->execute([
  $prefix . '-tostada-2',
  2.20,
  $toastCategory,
  'Producto de prueba 2',
  '/images/sections/editada-01.webp',
  json_encode(['Pan'], JSON_UNESCAPED_UNICODE),
  json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
  0,
  1,
  2,
]);
$toastTwoId = (int) $pdo->lastInsertId();

$insert->execute([
  $prefix . '-bebida-1',
  1.50,
  $drinkCategory,
  'Bebida de prueba',
  '/images/sections/editada-01.webp',
  json_encode(['Cafe'], JSON_UNESCAPED_UNICODE),
  json_encode([], JSON_UNESCAPED_UNICODE),
  0,
  1,
  1,
]);
$drinkId = (int) $pdo->lastInsertId();

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$_SESSION['admin_id'] = 1;

$_POST = [
  'id' => $toastTwoId,
  'category' => $toastCategory,
  'sort_order' => 1,
];

ob_start();
require __DIR__ . '/../products/update.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['ok'])) {
  $error = is_array($data) ? ($data['error'] ?? 'unknown_error') : 'invalid_json';
  fail_with_cleanup($pdo, $prefix, "update failed ($error)");
}

$rows = $pdo->prepare(
  "SELECT id, category, sort_order
   FROM menu_products
   WHERE active = 1 AND name LIKE ?
   ORDER BY category, sort_order, id"
);
$rows->execute([$prefix . '%']);
$products = $rows->fetchAll();

$ordersByCategory = [];
foreach ($products as $product) {
  $ordersByCategory[$product['category']][(int) $product['id']] = (int) $product['sort_order'];
}

if (($ordersByCategory[$toastCategory][$toastTwoId] ?? null) !== 1) {
  fail_with_cleanup($pdo, $prefix, 'updated product was not moved to position 1 inside its category');
}

if (($ordersByCategory[$toastCategory][$toastOneId] ?? null) !== 2) {
  fail_with_cleanup($pdo, $prefix, 'sibling product was not shifted inside the same category');
}

if (($ordersByCategory[$drinkCategory][$drinkId] ?? null) !== 1) {
  fail_with_cleanup($pdo, $prefix, 'another category changed while reordering a different category');
}

$cleanup = $pdo->prepare('DELETE FROM menu_products WHERE name LIKE ?');
$cleanup->execute([$prefix . '%']);
$cleanupCategories = $pdo->prepare('DELETE FROM menu_categories WHERE id LIKE ?');
$cleanupCategories->execute([$prefix . '%']);

echo "PASS\n";
