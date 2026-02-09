<?php
require_once __DIR__ . '/bootstrap.php';

function upsert_admin(PDO $pdo, string $email, string $password): array
{
  $email = trim($email);
  if ($email === '' || $password === '') {
    return ['ok' => false, 'error' => 'missing_credentials'];
  }

  $hash = password_hash($password, PASSWORD_DEFAULT);
  $stmt = $pdo->prepare(
    'INSERT INTO admins (email, password_hash)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
  );
  $stmt->execute([$email, $hash]);

  return ['ok' => true, 'email' => $email];
}

function parse_cli_args(array $argv): array
{
  $result = [];
  foreach ($argv as $arg) {
    if (strpos($arg, '--') !== 0 || strpos($arg, '=') === false) {
      continue;
    }
    [$key, $value] = explode('=', substr($arg, 2), 2);
    $result[$key] = $value;
  }
  return $result;
}

$isDirectCli = php_sapi_name() === 'cli' && realpath($argv[0] ?? '') === __FILE__;
$isDirectHttp = php_sapi_name() !== 'cli' && realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__;

if (!$isDirectCli && !$isDirectHttp) {
  return;
}

$input = $_POST;
if (php_sapi_name() === 'cli') {
  $input = parse_cli_args($argv ?? []);
}

$email = (string) ($input['email'] ?? '');
$password = (string) ($input['password'] ?? '');

try {
  $result = upsert_admin(get_pdo(), $email, $password);
  if (empty($result['ok'])) {
    Response::json($result, 400);
    return;
  }
  Response::json($result, 200);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
