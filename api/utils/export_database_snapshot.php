<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();
$databaseName = (string) $pdo->query('SELECT DATABASE()')->fetchColumn();

$tableNames = $pdo->query(
  "SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = DATABASE()
     AND table_type = 'BASE TABLE'
   ORDER BY table_name"
)->fetchAll(PDO::FETCH_COLUMN);

$tables = [];

foreach ($tableNames as $tableName) {
  $safeTableName = str_replace('`', '``', (string) $tableName);
  $tables[(string) $tableName] = $pdo->query("SELECT * FROM `{$safeTableName}`")->fetchAll();
}

$payload = [
  'database' => $databaseName,
  'generated_at' => gmdate('c'),
  'tables' => $tables,
];

$json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($json === false) {
  fwrite(STDERR, "FAIL: could not encode database snapshot\n");
  exit(1);
}

$outputPath = $argv[1] ?? null;

if ($outputPath) {
  $fullPath = $outputPath;

  if (!preg_match('/^[A-Za-z]:\\\\|^\//', $outputPath)) {
    $fullPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $outputPath);
  }

  $dir = dirname($fullPath);

  if (!is_dir($dir) && !mkdir($dir, 0777, true) && !is_dir($dir)) {
    fwrite(STDERR, "FAIL: could not create snapshot directory\n");
    exit(1);
  }

  if (file_put_contents($fullPath, $json . PHP_EOL) === false) {
    fwrite(STDERR, "FAIL: could not write snapshot file\n");
    exit(1);
  }

  echo json_encode([
    'ok' => true,
    'output' => $fullPath,
    'database' => $databaseName,
    'tables' => count($tableNames),
  ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit(0);
}

echo $json;
