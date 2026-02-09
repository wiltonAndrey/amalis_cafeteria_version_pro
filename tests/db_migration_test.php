<?php
require __DIR__ . '/../api/bootstrap.php';

ob_start();
require __DIR__ . '/../api/migration_cms.php';
ob_end_clean();

$pdo = get_pdo();
$tables = ['hero', 'features', 'philosophy', 'testimonials'];

foreach ($tables as $table) {
  $stmt = $pdo->query("SELECT COUNT(*) AS total FROM {$table}");
  $count = (int) $stmt->fetchColumn();
  if ($count === 0) {
    fwrite(STDERR, "FAIL: {$table} table is empty after migration\n");
    exit(1);
  }
}

echo "PASS\n";
