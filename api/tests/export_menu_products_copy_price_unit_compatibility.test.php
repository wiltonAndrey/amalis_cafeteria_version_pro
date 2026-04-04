<?php
require __DIR__ . '/support/temp_db.php';

function run_php_script(string $scriptPath, ?string $stdin = null): array
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

  fwrite($pipes[0], $stdin ?? '');
  fclose($pipes[0]);

  $stdout = stream_get_contents($pipes[1]);
  fclose($pipes[1]);

  $stderr = stream_get_contents($pipes[2]);
  fclose($pipes[2]);

  $exitCode = proc_close($process);

  return [$exitCode, $stdout, $stderr];
}

[$adminPdo, $pdo, $dbName] = temp_db_create('export_menu_products_copy_price_unit');

try {
  temp_db_create_legacy_menu_schema($pdo);

  $categoryId = 'export-compat-cat';
  $pdo->prepare('INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)')
    ->execute([$categoryId, 'Categoria export compat', 1]);

  $pdo->prepare(
    'INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )->execute([
    'Legacy export product',
    4.50,
    $categoryId,
    'Producto legacy export',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    1,
  ]);

  [$exitCode, $stdout, $stderr] = run_php_script(__DIR__ . '/../utils/export_menu_products_copy.php');

  if ($exitCode !== 0) {
    fwrite(STDERR, "FAIL: legacy export script failed: $stderr\n");
    exit(1);
  }

  $payload = json_decode($stdout, true);
  if (!is_array($payload) || count($payload) !== 1) {
    fwrite(STDERR, "FAIL: invalid legacy export payload\n");
    exit(1);
  }

  if (array_key_exists('price_unit', $payload[0])) {
    fwrite(STDERR, "FAIL: legacy export fabricated canonical price_unit\n");
    exit(1);
  }

  ob_start();
  require __DIR__ . '/../update_schema_price_unit.php';
  ob_end_clean();

  $pdo->prepare(
    'INSERT INTO menu_products (name, price, price_unit, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )->execute([
    'Migrated export kg',
    26.00,
    'kg',
    $categoryId,
    'Producto kg export',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    2,
  ]);

  [$exitCode, $stdout, $stderr] = run_php_script(__DIR__ . '/../utils/export_menu_products_copy.php');

  if ($exitCode !== 0) {
    fwrite(STDERR, "FAIL: migrated export script failed: $stderr\n");
    exit(1);
  }

  $payload = json_decode($stdout, true);
  if (!is_array($payload) || count($payload) !== 2) {
    fwrite(STDERR, "FAIL: invalid migrated export payload\n");
    exit(1);
  }

  $byName = [];
  foreach ($payload as $product) {
    $byName[$product['name'] ?? ''] = $product;
  }

  if (!isset($byName['Legacy export product']) || array_key_exists('price_unit', $byName['Legacy export product'])) {
    fwrite(STDERR, "FAIL: migrated export must omit null price_unit values\n");
    exit(1);
  }

  if (($byName['Migrated export kg']['price_unit'] ?? null) !== 'kg') {
    fwrite(STDERR, "FAIL: migrated export must keep trusted canonical price_unit values\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
