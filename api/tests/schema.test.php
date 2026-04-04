<?php
require __DIR__ . '/../bootstrap.php';
ob_start();
require __DIR__ . '/../update_schema_price_unit.php';
ob_end_clean();

$pdo = get_pdo();
$tables = [
  'menu_categories',
  'menu_products',
  'products',
  'promotion_cards',
  'settings',
  'admins',
  'hero',
  'features',
  'philosophy',
  'testimonials',
];
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

$columnStmt = $pdo->prepare(
  "SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT
   FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'menu_products'"
);
$columnStmt->execute();
$columnsMeta = $columnStmt->fetchAll();
$columns = array_column($columnsMeta, 'COLUMN_NAME');
$requiredColumns = ['alt_text', 'image_title', 'price_unit'];
$missingColumns = array_diff($requiredColumns, $columns);

if ($missingColumns) {
  fwrite(STDERR, "FAIL: missing columns in menu_products: " . implode(', ', $missingColumns) . "\n");
  exit(1);
}

$priceUnitMeta = null;
foreach ($columnsMeta as $columnMeta) {
  if (($columnMeta['COLUMN_NAME'] ?? '') === 'price_unit') {
    $priceUnitMeta = $columnMeta;
    break;
  }
}

$priceUnitDefault = $priceUnitMeta && array_key_exists('COLUMN_DEFAULT', $priceUnitMeta)
  ? $priceUnitMeta['COLUMN_DEFAULT']
  : 'unexpected';

if (!$priceUnitMeta || ($priceUnitMeta['IS_NULLABLE'] ?? '') !== 'YES' || $priceUnitDefault !== null) {
  fwrite(STDERR, "FAIL: invalid menu_products.price_unit definition\n");
  exit(1);
}

$promoColumnStmt = $pdo->prepare(
  "SELECT COLUMN_NAME
   FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'promotion_cards'"
);
$promoColumnStmt->execute();
$promoColumns = $promoColumnStmt->fetchAll(PDO::FETCH_COLUMN);
$requiredPromoColumns = [
  'image_alt',
  'image_title',
  'items',
  'availability_text',
  'cta_label',
  'cta_url',
];
$missingPromoColumns = array_diff($requiredPromoColumns, $promoColumns);

if ($missingPromoColumns) {
  fwrite(STDERR, "FAIL: missing columns in promotion_cards: " . implode(', ', $missingPromoColumns) . "\n");
  exit(1);
}

echo "PASS\n";
