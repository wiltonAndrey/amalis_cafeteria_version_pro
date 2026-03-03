<?php

require __DIR__ . '/../bootstrap.php';

function cleanup_restore_test_tables(PDO $pdo, array $tables): void
{
  foreach (array_reverse($tables) as $table) {
    $safeTable = str_replace('`', '``', $table);
    $pdo->exec("DROP TABLE IF EXISTS `{$safeTable}`");
  }
}

function fail_restore_test(PDO $pdo, array $tables, string $snapshotPath, string $message): void
{
  @unlink($snapshotPath);
  cleanup_restore_test_tables($pdo, $tables);
  fwrite(STDERR, "FAIL: {$message}\n");
  exit(1);
}

$script = __DIR__ . '/../utils/restore_database_snapshot.php';

if (!is_file($script)) {
  fwrite(STDERR, "FAIL: missing restore_database_snapshot.php\n");
  exit(1);
}

$pdo = get_pdo();
$databaseName = (string) $pdo->query('SELECT DATABASE()')->fetchColumn();
$prefix = 'restore_snapshot_test_' . bin2hex(random_bytes(4));
$tableAlpha = $prefix . '_alpha';
$tableBeta = $prefix . '_beta';
$tables = [$tableAlpha, $tableBeta];
$snapshotPath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $prefix . '.json';

cleanup_restore_test_tables($pdo, $tables);

$pdo->exec("CREATE TABLE `{$tableAlpha}` (id INT NOT NULL PRIMARY KEY, label VARCHAR(120) NOT NULL)");
$pdo->exec("CREATE TABLE `{$tableBeta}` (id INT NOT NULL PRIMARY KEY, amount INT NOT NULL, note VARCHAR(120) NULL)");

$pdo->exec("INSERT INTO `{$tableAlpha}` (id, label) VALUES (99, 'old alpha')");
$pdo->exec("INSERT INTO `{$tableBeta}` (id, amount, note) VALUES (99, 999, 'old beta')");

$snapshot = [
  'database' => $databaseName,
  'generated_at' => gmdate('c'),
  'tables' => [
    $tableAlpha => [
      ['id' => 1, 'label' => 'alpha one'],
      ['id' => 2, 'label' => 'alpha two'],
    ],
    $tableBeta => [
      ['id' => 10, 'amount' => 25, 'note' => null],
    ],
  ],
];

if (file_put_contents($snapshotPath, json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
  fail_restore_test($pdo, $tables, $snapshotPath, 'could not write snapshot fixture');
}

$command = escapeshellarg(PHP_BINARY)
  . ' '
  . escapeshellarg($script)
  . ' '
  . escapeshellarg($snapshotPath)
  . ' --force';

$output = [];
$exitCode = 0;
exec($command, $output, $exitCode);

if ($exitCode !== 0) {
  fail_restore_test($pdo, $tables, $snapshotPath, 'restore command failed');
}

$alphaRows = $pdo->query("SELECT id, label FROM `{$tableAlpha}` ORDER BY id")->fetchAll();
$betaRows = $pdo->query("SELECT id, amount, note FROM `{$tableBeta}` ORDER BY id")->fetchAll();

@unlink($snapshotPath);
cleanup_restore_test_tables($pdo, $tables);

if (count($alphaRows) !== 2) {
  fwrite(STDERR, "FAIL: alpha table row count mismatch\n");
  exit(1);
}

if ((string) ($alphaRows[0]['id'] ?? '') !== '1' || (string) ($alphaRows[0]['label'] ?? '') !== 'alpha one') {
  fwrite(STDERR, "FAIL: alpha first row mismatch\n");
  exit(1);
}

if ((string) ($alphaRows[1]['id'] ?? '') !== '2' || (string) ($alphaRows[1]['label'] ?? '') !== 'alpha two') {
  fwrite(STDERR, "FAIL: alpha second row mismatch\n");
  exit(1);
}

if (count($betaRows) !== 1) {
  fwrite(STDERR, "FAIL: beta table row count mismatch\n");
  exit(1);
}

if ((string) ($betaRows[0]['id'] ?? '') !== '10' || (string) ($betaRows[0]['amount'] ?? '') !== '25') {
  fwrite(STDERR, "FAIL: beta row mismatch\n");
  exit(1);
}

if (!array_key_exists('note', $betaRows[0]) || $betaRows[0]['note'] !== null) {
  fwrite(STDERR, "FAIL: beta null value was not restored\n");
  exit(1);
}

echo "PASS\n";
