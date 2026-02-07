<?php
require_once __DIR__ . '/../bootstrap.php';

function json_response(array $payload, int $status = 200): void
{
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

function login_admin(PDO $pdo, string $email, string $password): array
{
  $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $admin = $stmt->fetch();

  if (!$admin || !password_verify($password, $admin['password_hash'])) {
    return ['ok' => false];
  }

  $_SESSION['admin_id'] = $admin['id'];
  $_SESSION['admin_email'] = $admin['email'];

  return ['ok' => true, 'admin' => ['id' => $admin['id'], 'email' => $admin['email']]];
}

function require_auth(): array
{
  if (empty($_SESSION['admin_id'])) {
    return ['ok' => false];
  }

  return ['ok' => true, 'admin' => [
    'id' => $_SESSION['admin_id'],
    'email' => $_SESSION['admin_email'] ?? '',
  ]];
}
