<?php
require __DIR__ . '/support/temp_db.php';

function run_legacy_sync_script(string $scriptPath, array $payload): array
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

[$adminPdo, $pdo, $dbName] = temp_db_create('sync_products_legacy_null');

try {
  temp_db_create_legacy_menu_schema($pdo);

  $payload = [
    'action' => 'sync_menu_products',
    'products' => [
      [
        'name' => 'Legacy sync null canonical',
        'price' => 4.50,
        'price_unit' => null,
        'category' => 'legacy-sync-cat',
        'description' => 'Producto legacy sync',
        'image' => '/images/test.webp',
        'ingredients' => ['Harina'],
        'allergens' => ['Gluten'],
        'featured' => 0,
        'active' => 1,
        'sort_order' => 1,
      ],
    ],
  ];

  [$exitCode, $stdout, $stderr] = run_legacy_sync_script(__DIR__ . '/../utils/sync_products.php', $payload);

  if ($exitCode !== 0) {
    fwrite(STDERR, "FAIL: legacy sync subprocess failed: $stderr\n");
    exit(1);
  }

  $result = json_decode($stdout, true);
  if (!is_array($result) || empty($result['success'])) {
    fwrite(STDERR, "FAIL: legacy sync rejected null compatibility payload: $stdout\n");
    exit(1);
  }

  $row = $pdo->query("SELECT name FROM menu_products WHERE name = 'Legacy sync null canonical' LIMIT 1")->fetch();
  if (!$row) {
    fwrite(STDERR, "FAIL: legacy sync did not insert product when price_unit was null\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
