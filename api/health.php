<?php
require __DIR__ . '/bootstrap.php';

try {
  $pdo = get_pdo();
  $stmt = $pdo->prepare('SELECT 1 AS ok');
  $stmt->execute();
  $row = $stmt->fetch();

  if (!isset($row['ok']) || (int) $row['ok'] !== 1) {
    Response::error('health_check_failed', 503);
    return;
  }

  api_send_cached_json([
    'ok' => true,
    'status' => 'healthy',
    'requestId' => api_request_id(),
    'time' => gmdate('c'),
  ], 10);
} catch (Throwable $error) {
  Response::error('health_check_failed', 503, $error);
}
