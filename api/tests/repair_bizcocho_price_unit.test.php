<?php
require __DIR__ . '/support/temp_db.php';

[$adminPdo, $pdo, $dbName] = temp_db_create('repair_bizcocho_price_unit');

try {
  require __DIR__ . '/../bootstrap.php';
  temp_db_create_legacy_menu_schema($pdo);
  require __DIR__ . '/../update_schema_price_unit.php';

  $pdo->exec(
    "INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES
      ('pasteleria', 'Pasteleria', 1, 1, 1),
      ('bolleria-dulce', 'Bolleria dulce', 2, 1, 1),
      ('tostadas', 'Tostadas', 3, 1, 1)"
  );

  $insert = $pdo->prepare(
    'INSERT INTO menu_products (name, price, price_unit, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  $rows = [
    ['Bizcocho de Limon', 12.00, 'unit', 'pasteleria', 1],
    ['Bizcocho marmolado', 14.00, 'unit', 'bolleria-dulce', 2],
    ['Croissant', 1.60, 'unit', 'bolleria-dulce', 3],
    ['Bizcocho de cacao', 16.00, 'kg', 'pasteleria', 4],
    ['Bizcocho inactivo', 11.00, 'unit', 'pasteleria', 5],
    ['Bizcocho tostado', 9.00, 'unit', 'tostadas', 6],
  ];

  foreach ($rows as [$name, $price, $priceUnit, $category, $sortOrder]) {
    $insert->execute([
      $name,
      $price,
      $priceUnit,
      $category,
      'Test',
      '/images/test.webp',
      json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
      json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
      0,
      $name === 'Bizcocho inactivo' ? 0 : 1,
      $sortOrder,
    ]);
  }

  $GLOBALS['config'] = [
    'host' => '127.0.0.1',
    'name' => $dbName,
    'user' => temp_db_config()['user'],
    'pass' => temp_db_config()['pass'],
  ];

  require __DIR__ . '/../utils/repair_bizcocho_price_unit.php';

  $dryRun = repair_bizcocho_price_unit($pdo, false);
  if (($dryRun['matching_rows_before'] ?? null) !== 2 || ($dryRun['updated_rows'] ?? null) !== 0) {
    fwrite(STDERR, "FAIL: dry-run must report exactly the two matching canonical mistakes without mutating data\n");
    exit(1);
  }

  $applied = repair_bizcocho_price_unit($pdo, true);
  if (($applied['updated_rows'] ?? null) !== 2) {
    fwrite(STDERR, "FAIL: repair must update exactly the matching bizcochos\n");
    exit(1);
  }

  $byName = [];
  foreach ($pdo->query('SELECT name, category, active, price_unit FROM menu_products ORDER BY id')->fetchAll() as $row) {
    $byName[$row['name']] = $row;
  }

  if (($byName['Bizcocho de Limon']['price_unit'] ?? null) !== 'kg') {
    fwrite(STDERR, "FAIL: pasteleria bizcocho must switch to kg\n");
    exit(1);
  }

  if (($byName['Bizcocho marmolado']['price_unit'] ?? null) !== 'kg') {
    fwrite(STDERR, "FAIL: bolleria-dulce bizcocho must switch to kg\n");
    exit(1);
  }

  if (($byName['Croissant']['price_unit'] ?? null) !== 'unit') {
    fwrite(STDERR, "FAIL: non-bizcocho rows must remain untouched\n");
    exit(1);
  }

  if (($byName['Bizcocho de cacao']['price_unit'] ?? null) !== 'kg') {
    fwrite(STDERR, "FAIL: already-correct kg rows must remain untouched\n");
    exit(1);
  }

  if (($byName['Bizcocho inactivo']['price_unit'] ?? null) !== 'unit') {
    fwrite(STDERR, "FAIL: inactive rows must remain untouched\n");
    exit(1);
  }

  if (($byName['Bizcocho tostado']['price_unit'] ?? null) !== 'unit') {
    fwrite(STDERR, "FAIL: rows outside sweet bizcocho categories must remain untouched\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
