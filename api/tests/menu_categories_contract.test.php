<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();

$categories = $pdo->query(
  'SELECT id FROM menu_categories ORDER BY sort_order, id'
)->fetchAll(PDO::FETCH_COLUMN);

$expected = [
  'all',
  'tostadas',
  'bolleria-salada',
  'bolleria-dulce',
  'pasteleria',
  'ofertas',
  'bebidas',
];

if ($categories !== $expected) {
  fwrite(STDERR, "FAIL: menu_categories order mismatch\n");
  fwrite(STDERR, 'Expected: ' . json_encode($expected, JSON_UNESCAPED_UNICODE) . "\n");
  fwrite(STDERR, 'Actual: ' . json_encode($categories, JSON_UNESCAPED_UNICODE) . "\n");
  exit(1);
}

$productCategories = $pdo->query(
  'SELECT DISTINCT category FROM menu_products WHERE active = 1 ORDER BY category'
)->fetchAll(PDO::FETCH_COLUMN);

$allowed = [
  'bebidas',
  'bolleria-dulce',
  'bolleria-salada',
  'ofertas',
  'pasteleria',
  'tostadas',
];

$unexpected = array_values(array_diff($productCategories, $allowed));

if ($unexpected) {
  fwrite(STDERR, "FAIL: unexpected menu_products categories\n");
  fwrite(STDERR, 'Unexpected: ' . json_encode($unexpected, JSON_UNESCAPED_UNICODE) . "\n");
  exit(1);
}

echo "PASS\n";
