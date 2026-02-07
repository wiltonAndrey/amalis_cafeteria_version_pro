<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../auth/_auth.php';

$pdo = get_pdo();
$email = 'admin@example.com';
$password = 'ChangeMe123!';

$pdo->prepare('DELETE FROM admins WHERE email = ?')->execute([$email]);
$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)')->execute([$email, $hash]);

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
