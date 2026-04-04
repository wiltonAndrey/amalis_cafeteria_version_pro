<?php
require __DIR__ . '/support/temp_db.php';

function run_sync_script(string $scriptPath, array $payload): array
{
  $command = '"' . PHP_BINARY . '" "' . $scriptPath . '"';
  $descriptorSpec = [
    0 => ['pipe', 'r'],
    1 => ['pipe', 'w'],
    2 => ['pipe', 'w'],
  ];

  $process = proc_open($command, $descriptorSpec, $pipes, dirname(__DIR__, 2));
  if (!is_resource($process)) {
    throw new RuntimeException('Could not start PHP subprocess');
  }

  fwrite($pipes[0], json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  fclose($pipes[0]);

  $stdout = stream_get_contents($pipes[1]);
  fclose($pipes[1]);

  $stderr = stream_get_contents($pipes[2]);
  fclose($pipes[2]);

  $exitCode = proc_close($process);

  return [$exitCode, $stdout, $stderr];
}

function fail_sync_test(PDO $pdo, string $message): void
{
  $rows = $pdo->query('SELECT name, price_unit FROM menu_products ORDER BY id')->fetchAll();
  fwrite(STDERR, "FAIL: $message\nCurrent rows: " . json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
  exit(1);
}

[$adminPdo, $pdo, $dbName] = temp_db_create('sync_products_price_unit');

try {
  temp_db_create_legacy_menu_schema($pdo);

  $categoryId = 'sync-compat-cat';
  $pdo->prepare('INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)')
    ->execute([$categoryId, 'Categoria sync compat', 1]);

  ob_start();
  require __DIR__ . '/../update_schema_price_unit.php';
  ob_end_clean();

  $insertProduct = $pdo->prepare(
    'INSERT INTO menu_products (name, price, price_unit, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  $insertProduct->execute([
    'Sync null canonical',
    4.50,
    null,
    $categoryId,
    'Producto sin canonical',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    1,
  ]);

  $insertProduct->execute([
    'Sync kg canonical',
    26.00,
    'kg',
    $categoryId,
    'Producto kg canonico',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    2,
  ]);

  $exportPayload = [
    [
      'name' => 'Sync null canonical',
      'price' => 4.50,
      'category' => $categoryId,
      'description' => 'Producto sin canonical',
      'image' => '/images/test.webp',
      'ingredients' => ['Harina'],
      'allergens' => ['Gluten'],
      'featured' => 0,
      'active' => 1,
      'sort_order' => 1,
    ],
    [
      'name' => 'Sync kg canonical',
      'price' => 26.00,
      'price_unit' => 'kg',
      'category' => $categoryId,
      'description' => 'Producto kg canonico',
      'image' => '/images/test.webp',
      'ingredients' => ['Harina'],
      'allergens' => ['Gluten'],
      'featured' => 0,
      'active' => 1,
      'sort_order' => 2,
    ],
  ];

  [$exitCode, $stdout, $stderr] = run_sync_script(__DIR__ . '/../utils/sync_products.php', [
    'action' => 'sync_menu_products',
    'products' => $exportPayload,
  ]);

  if ($exitCode !== 0) {
    fail_sync_test($pdo, 'sync subprocess failed during export round-trip: ' . $stderr);
  }

  $result = json_decode($stdout, true);
  if (!is_array($result) || empty($result['success'])) {
    fail_sync_test($pdo, 'sync rejected export-compatible payload: ' . $stdout);
  }

  $rows = $pdo->query("SELECT name, price_unit FROM menu_products WHERE name IN ('Sync null canonical', 'Sync kg canonical') ORDER BY name")
    ->fetchAll();
  $byName = [];
  foreach ($rows as $row) {
    $byName[$row['name']] = $row['price_unit'];
  }

  if (!array_key_exists('Sync null canonical', $byName) || $byName['Sync null canonical'] !== null) {
    fail_sync_test($pdo, 'sync should preserve null canonical state when export omitted price_unit');
  }

  if (($byName['Sync kg canonical'] ?? null) !== 'kg') {
    fail_sync_test($pdo, 'sync should preserve explicit canonical kg state during round-trip');
  }

  [$exitCode, $stdout, $stderr] = run_sync_script(__DIR__ . '/../utils/sync_products.php', [
    'action' => 'sync_menu_products',
    'products' => [
      [
        'name' => 'Sync kg canonical',
        'price' => 26.00,
        'price_unit' => null,
        'category' => $categoryId,
        'description' => 'Producto kg canonico actualizado',
        'image' => '/images/test.webp',
        'ingredients' => ['Harina'],
        'allergens' => ['Gluten'],
        'featured' => 0,
        'active' => 1,
        'sort_order' => 2,
      ],
    ],
  ]);

  if ($exitCode !== 0) {
    fail_sync_test($pdo, 'sync subprocess failed for compatibility payload with null price_unit: ' . $stderr);
  }

  $result = json_decode($stdout, true);
  if (!is_array($result) || empty($result['success'])) {
    fail_sync_test($pdo, 'sync rejected compatibility payload with null price_unit: ' . $stdout);
  }

  $row = $pdo->query("SELECT price_unit, description FROM menu_products WHERE name = 'Sync kg canonical' LIMIT 1")->fetch();
  if (!$row || ($row['price_unit'] ?? null) !== 'kg') {
    fail_sync_test($pdo, 'sync overwrote canonical kg with null compatibility payload');
  }

  if (($row['description'] ?? '') !== 'Producto kg canonico actualizado') {
    fail_sync_test($pdo, 'sync did not update non-canonical fields for null compatibility payload');
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
