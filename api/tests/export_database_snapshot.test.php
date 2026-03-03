<?php

$script = __DIR__ . '/../utils/export_database_snapshot.php';

if (!is_file($script)) {
  fwrite(STDERR, "FAIL: missing export_database_snapshot.php\n");
  exit(1);
}

$tmpFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'amalis-db-snapshot-' . bin2hex(random_bytes(4)) . '.json';
$command = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($tmpFile);

$output = [];
$exitCode = 0;
exec($command, $output, $exitCode);

if ($exitCode !== 0) {
  @unlink($tmpFile);
  fwrite(STDERR, "FAIL: export command failed\n");
  exit(1);
}

if (!is_file($tmpFile)) {
  fwrite(STDERR, "FAIL: export file was not created\n");
  exit(1);
}

$json = file_get_contents($tmpFile);
@unlink($tmpFile);

$data = json_decode((string) $json, true);

if (!is_array($data)) {
  fwrite(STDERR, "FAIL: export output is not valid JSON\n");
  exit(1);
}

if (empty($data['database']) || !is_string($data['database'])) {
  fwrite(STDERR, "FAIL: missing database metadata\n");
  exit(1);
}

if (!isset($data['tables']) || !is_array($data['tables'])) {
  fwrite(STDERR, "FAIL: missing tables payload\n");
  exit(1);
}

if (!array_key_exists('menu_products', $data['tables']) || !is_array($data['tables']['menu_products'])) {
  fwrite(STDERR, "FAIL: missing menu_products export\n");
  exit(1);
}

if (!array_key_exists('settings', $data['tables']) || !is_array($data['tables']['settings'])) {
  fwrite(STDERR, "FAIL: missing settings export\n");
  exit(1);
}

echo "PASS\n";
