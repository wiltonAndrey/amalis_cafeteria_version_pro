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

  if (!is_array($body)) {
    Response::json(['ok' => false, 'error' => 'invalid_payload'], 400);
    return;
  }

  try {
    $pdo->beginTransaction();
    $pdo->exec('DELETE FROM testimonials');

    if (!empty($body)) {
      $stmt = $pdo->prepare(
        'INSERT INTO testimonials (name, role, content, avatar_url, sort_order) VALUES (?, ?, ?, ?, ?)'
      );

      foreach ($body as $index => $testimonial) {
        if (!is_array($testimonial)) {
          throw new RuntimeException('invalid_testimonial');
        }

        $name = Validator::string_trim($testimonial['name'] ?? '');
        $role = Validator::string_trim($testimonial['role'] ?? '');
        $content = Validator::string_trim($testimonial['content'] ?? '');
        $avatarUrl = Validator::string_trim($testimonial['avatarUrl'] ?? '');
        $sortOrder = $testimonial['sortOrder'] ?? ($index + 1);

        if (!Validator::required($name) || !Validator::required($role) || !Validator::required($content) || !Validator::required($avatarUrl)) {
          throw new RuntimeException('missing_fields');
        }

        $stmt->execute([$name, $role, $content, $avatarUrl, (int) $sortOrder]);
      }
    }

    $pdo->commit();
    Response::json(['ok' => true]);
  } catch (RuntimeException $error) {
    if ($pdo->inTransaction()) {
      $pdo->rollBack();
    }
    Response::json(['ok' => false, 'error' => $error->getMessage()], 400);
  } catch (Throwable $error) {
    if ($pdo->inTransaction()) {
      $pdo->rollBack();
    }
    Response::json(['ok' => false, 'error' => 'db_error'], 500);
  }

  return;
}

try {
  $rows = $pdo->query(
    'SELECT id, name, role, content, avatar_url, sort_order FROM testimonials ORDER BY sort_order, id'
  )->fetchAll();

  $payload = array_map(function (array $row): array {
    return [
      'id' => (string) $row['id'],
      'name' => $row['name'],
      'role' => $row['role'],
      'content' => $row['content'],
      'avatarUrl' => $row['avatar_url'],
      'sortOrder' => (int) $row['sort_order'],
    ];
  }, $rows);

  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
