<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();

$desiredCategories = [
  ['all', 'Todos', 0],
  ['tostadas', 'Tostadas', 1],
  ['bolleria-salada', 'Bolleria salada', 2],
  ['bolleria-dulce', 'Bolleria dulce', 3],
  ['pasteleria', 'Pasteleria', 4],
  ['ofertas', 'Ofertas', 5],
  ['bebidas', 'Bebidas', 6],
];

$productCategoryMap = [
  'cocas' => 'bolleria-salada',
  'empanadillas' => 'bolleria-salada',
  'bolleria_salada' => 'bolleria-salada',
  'bolleria' => 'bolleria-dulce',
  'bolleria_dulce' => 'bolleria-dulce',
  'bizcochos' => 'pasteleria',
  'pasteles' => 'pasteleria',
];

$allowedCategoryIds = array_map(static fn(array $category): string => $category[0], $desiredCategories);

try {
  $pdo->beginTransaction();

  $updateProductCategory = $pdo->prepare('UPDATE menu_products SET category = ? WHERE category = ?');
  foreach ($productCategoryMap as $from => $to) {
    $updateProductCategory->execute([$to, $from]);
  }

  $upsertCategory = $pdo->prepare(
    'INSERT INTO menu_categories (id, label, sort_order)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order)'
  );

  foreach ($desiredCategories as [$id, $label, $sortOrder]) {
    $upsertCategory->execute([$id, $label, $sortOrder]);
  }

  $placeholders = implode(',', array_fill(0, count($allowedCategoryIds), '?'));
  $deleteObsolete = $pdo->prepare("DELETE FROM menu_categories WHERE id NOT IN ($placeholders)");
  $deleteObsolete->execute($allowedCategoryIds);

  $pdo->commit();

  echo json_encode([
    'ok' => true,
    'menu_categories' => $pdo->query(
      'SELECT id, label, sort_order FROM menu_categories ORDER BY sort_order, id'
    )->fetchAll(),
    'menu_product_categories' => $pdo->query(
      'SELECT category, COUNT(*) AS total FROM menu_products WHERE active = 1 GROUP BY category ORDER BY category'
    )->fetchAll(),
  ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }

  fwrite(STDERR, "FAIL: {$error->getMessage()}\n");
  exit(1);
}
