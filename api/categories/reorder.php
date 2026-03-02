<?php
require __DIR__ . '/../bootstrap.php';

$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

if (!api_require_request_guard('categories_reorder', 90, 60)) {
  return;
}

$input = menu_categories_read_request_input();
$items = menu_categories_parse_reorder_items($input['items'] ?? null);

if ($items === []) {
  Response::json(['ok' => false, 'error' => 'invalid_items'], 400);
  return;
}

$seen = [];
foreach ($items as $item) {
  if (isset($seen[$item['id']])) {
    Response::json(['ok' => false, 'error' => 'duplicate_items'], 400);
    return;
  }
  $seen[$item['id']] = true;
}

try {
  $pdo = get_pdo();
  menu_categories_ensure_schema($pdo);

  $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM menu_categories WHERE id = ?');
  foreach ($items as $item) {
    $checkStmt->execute([$item['id']]);
    if ((int) $checkStmt->fetchColumn() === 0) {
      Response::json(['ok' => false, 'error' => 'not_found'], 404);
      return;
    }
  }

  $updateStmt = $pdo->prepare('UPDATE menu_categories SET sort_order = ? WHERE id = ?');

  $pdo->beginTransaction();
  foreach ($items as $item) {
    if ($item['id'] === 'all') {
      continue;
    }
    $updateStmt->execute([(int) $item['sort_order'], (string) $item['id']]);
  }
  $pdo->commit();

  Response::json([
    'ok' => true,
    'categories' => menu_categories_list_admin($pdo),
  ]);
} catch (Throwable $error) {
  if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  Response::error('db_error', 500, $error);
}
