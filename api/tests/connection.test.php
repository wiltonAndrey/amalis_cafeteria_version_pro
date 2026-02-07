<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();
$stmt = $pdo->query('SELECT 1 AS ok');
$row = $stmt->fetch();

if (!isset($row['ok']) || (int) $row['ok'] !== 1) {
  fwrite(STDERR, "FAIL: DB query did not return 1\n");
  exit(1);
}

echo "PASS\n";
