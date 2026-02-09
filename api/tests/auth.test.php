<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../auth/_auth.php';
require __DIR__ . '/../setup_admin.php';

$pdo = get_pdo();
$email = 'admin@example.com';
$password = 'ChangeMe123!';

$result = upsert_admin($pdo, $email, $password);
if (empty($result['ok'])) {
  fwrite(STDERR, "FAIL: setup admin failed\n");
  exit(1);
}

session_start();
$result = login_admin($pdo, $email, $password);
if (empty($result['ok'])) {
  fwrite(STDERR, "FAIL: login failed\n");
  exit(1);
}

$verify = require_auth();
if (empty($verify['ok'])) {
  fwrite(STDERR, "FAIL: verify failed\n");
  exit(1);
}

echo "PASS\n";
