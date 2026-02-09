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
    $pdo->exec('DELETE FROM features');

    if (!empty($body)) {
      $stmt = $pdo->prepare(
        'INSERT INTO features (title, description, icon, sort_order) VALUES (?, ?, ?, ?)'
      );

      foreach ($body as $index => $feature) {
        if (!is_array($feature)) {
          throw new RuntimeException('invalid_feature');
        }

        $title = Validator::string_trim($feature['title'] ?? '');
        $description = Validator::string_trim($feature['description'] ?? '');
        $icon = Validator::string_trim($feature['icon'] ?? '');
        $sortOrder = $feature['sortOrder'] ?? ($index + 1);

        if (!Validator::required($title) || !Validator::required($description) || !Validator::required($icon)) {
          throw new RuntimeException('missing_fields');
        }

        $stmt->execute([$title, $description, $icon, (int) $sortOrder]);
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
    'SELECT id, title, description, icon, sort_order FROM features ORDER BY sort_order, id'
  )->fetchAll();

  $payload = array_map(function (array $row): array {
    return [
      'id' => (string) $row['id'],
      'title' => $row['title'],
      'description' => $row['description'],
      'icon' => $row['icon'],
      'sortOrder' => (int) $row['sort_order'],
    ];
  }, $rows);

  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
