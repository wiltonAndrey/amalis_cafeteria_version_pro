<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();
$tables = ['menu_categories', 'menu_products', 'products', 'settings', 'admins'];
$placeholders = implode(',', array_fill(0, count($tables), '?'));
$stmt = $pdo->prepare(
  "SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = DATABASE()
     AND table_name IN ($placeholders)"
);
$stmt->execute($tables);
$found = $stmt->fetchAll(PDO::FETCH_COLUMN);

$missing = array_diff($tables, $found);
if ($missing) {
  fwrite(STDERR, "FAIL: missing tables: " . implode(', ', $missing) . "\n");
  exit(1);
}

echo "PASS\n";
