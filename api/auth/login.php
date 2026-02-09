<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/_auth.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim((string) ($body['email'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
  Response::json(['ok' => false, 'error' => 'missing_credentials'], 400);
  return;
}

$result = login_admin(get_pdo(), $email, $password);
if (!$result['ok']) {
  Response::json(['ok' => false, 'error' => 'invalid_credentials'], 401);
  return;
}

Response::json($result);
