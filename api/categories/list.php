<?php
require __DIR__ . '/../bootstrap.php';

$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

try {
  $pdo = get_pdo();
  menu_categories_ensure_schema($pdo);

  Response::json([
    'ok' => true,
    'categories' => menu_categories_list_admin($pdo),
  ]);
} catch (Throwable $error) {
  Response::error('db_error', 500, $error);
}
