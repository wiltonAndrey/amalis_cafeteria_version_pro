<?php
require __DIR__ . '/../bootstrap.php';

$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$input = array_merge($_POST, is_array($body) ? $body : []);

$id = isset($input['id']) ? (int) $input['id'] : 0;
if ($id <= 0) {
  Response::json(['ok' => false, 'error' => 'missing_id'], 400);
  return;
}

try {
  $pdo = get_pdo();
  $exists = $pdo->prepare('SELECT id, active FROM menu_products WHERE id = ? LIMIT 1');
  $exists->execute([$id]);
  $row = $exists->fetch();

  if (!$row || (int) $row['active'] === 0) {
    Response::json(['ok' => false, 'error' => 'not_found'], 404);
    return;
  }

  $stmt = $pdo->prepare('UPDATE menu_products SET active = 0 WHERE id = ?');
  $stmt->execute([$id]);

  Response::json(['ok' => true, 'updated' => $stmt->rowCount()]);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
