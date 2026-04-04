<?php
require __DIR__ . '/support/temp_db.php';

[$adminPdo, $pdo, $dbName] = temp_db_create('update_schema_price_unit_legacy_safety');

try {
  temp_db_create_legacy_menu_schema($pdo);
  $pdo->exec("INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES ('legacy-cat', 'Legacy', 1, 1, 1)");
  $pdo->prepare(
    'INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )->execute([
    'Bizcocho legacy',
    26.00,
    'legacy-cat',
    'Legacy',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    1,
  ]);

  require __DIR__ . '/../bootstrap.php';

  ob_start();
  require __DIR__ . '/../update_schema_price_unit.php';
  ob_end_clean();

  $columnStmt = $pdo->prepare(
    "SELECT IS_NULLABLE, COLUMN_DEFAULT
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'menu_products'
       AND COLUMN_NAME = 'price_unit'"
  );
  $columnStmt->execute();
  $column = $columnStmt->fetch();

  $columnDefault = $column && array_key_exists('COLUMN_DEFAULT', $column)
    ? $column['COLUMN_DEFAULT']
    : 'unexpected';

  if (!$column || ($column['IS_NULLABLE'] ?? '') !== 'YES' || $columnDefault !== null) {
    fwrite(STDERR, "FAIL: migration did not keep price_unit nullable for safe legacy rollout\n");
    exit(1);
  }

  $row = $pdo->query("SELECT price_unit FROM menu_products WHERE name = 'Bizcocho legacy' LIMIT 1")->fetch();
  $rowPriceUnit = $row && array_key_exists('price_unit', $row)
    ? $row['price_unit']
    : 'unexpected';

  if ($rowPriceUnit !== null) {
    fwrite(STDERR, "FAIL: migration overwrote legacy price semantics with fabricated canonical data\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
