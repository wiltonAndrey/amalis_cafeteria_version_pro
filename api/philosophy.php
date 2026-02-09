<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'POST') {
  $auth = require_auth();
  if (empty($auth['ok'])) {
    return;
  }

  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  $input = array_merge($_POST, is_array($body) ? $body : []);

  $title = Validator::string_trim($input['title'] ?? '');
  $content = Validator::string_trim($input['content'] ?? '');
  $image = Validator::string_trim($input['image'] ?? '');

  if (!Validator::required($title) || !Validator::required($content) || !Validator::required($image)) {
    Response::json(['ok' => false, 'error' => 'missing_fields'], 400);
    return;
  }

  try {
    $row = $pdo->query('SELECT id FROM philosophy ORDER BY id LIMIT 1')->fetch();
    if ($row) {
      $stmt = $pdo->prepare(
        'UPDATE philosophy SET title = ?, content = ?, image = ? WHERE id = ?'
      );
      $stmt->execute([$title, $content, $image, $row['id']]);
    } else {
      $stmt = $pdo->prepare(
        'INSERT INTO philosophy (title, content, image) VALUES (?, ?, ?)'
      );
      $stmt->execute([$title, $content, $image]);
    }

    Response::json(['ok' => true]);
  } catch (Throwable $error) {
    Response::json(['ok' => false, 'error' => 'db_error'], 500);
  }

  return;
}

try {
  $row = $pdo->query(
    'SELECT title, content, image FROM philosophy ORDER BY id LIMIT 1'
  )->fetch();

  if (!$row) {
    echo json_encode([
      'title' => '',
      'content' => '',
      'image' => '',
    ], JSON_UNESCAPED_UNICODE);
    return;
  }

  echo json_encode([
    'title' => $row['title'],
    'content' => $row['content'],
    'image' => $row['image'],
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
