<?php
require __DIR__ . '/../bootstrap.php';

$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

if (!api_require_request_guard('categories_update', 60, 60)) {
  return;
}

$input = menu_categories_read_request_input();
$currentId = menu_categories_normalize_slug($input['id'] ?? '');
if ($currentId === '') {
  Response::json(['ok' => false, 'error' => 'missing_id'], 400);
  return;
}

try {
  $pdo = get_pdo();
  menu_categories_ensure_schema($pdo);

  $existingStmt = $pdo->prepare('SELECT id, label, sort_order, active, visible_in_menu FROM menu_categories WHERE id = ? LIMIT 1');
  $existingStmt->execute([$currentId]);
  $existing = $existingStmt->fetch();

  if (!$existing) {
    Response::json(['ok' => false, 'error' => 'not_found'], 404);
    return;
  }

  if (menu_categories_is_reserved_slug($currentId)) {
    Response::json(['ok' => false, 'error' => 'system_category_locked'], 400);
    return;
  }

  $hasLabel = array_key_exists('label', $input);
  $hasSlug = array_key_exists('slug', $input);
  $hasSort = array_key_exists('sort_order', $input);
  $hasActive = array_key_exists('active', $input);
  $hasVisible = array_key_exists('visible_in_menu', $input);

  if (!$hasLabel && !$hasSlug && !$hasSort && !$hasActive && !$hasVisible) {
    Response::json(['ok' => false, 'error' => 'no_fields'], 400);
    return;
  }

  $nextLabel = $hasLabel ? menu_categories_normalize_label($input['label']) : (string) $existing['label'];
  $labelError = menu_categories_validate_label($nextLabel);
  if ($labelError !== null) {
    Response::json(['ok' => false, 'error' => $labelError], 400);
    return;
  }

  $nextId = $hasSlug ? menu_categories_normalize_slug($input['slug']) : $currentId;
  $slugError = menu_categories_validate_slug($nextId);
  if ($slugError !== null) {
    Response::json(['ok' => false, 'error' => $slugError], 400);
    return;
  }

  if (menu_categories_is_reserved_slug($nextId)) {
    Response::json(['ok' => false, 'error' => 'reserved_slug'], 400);
    return;
  }

  if (menu_categories_is_protected_slug_rename($currentId, $nextId)) {
    Response::json(['ok' => false, 'error' => 'protected_slug'], 400);
    return;
  }

  if ($nextId !== $currentId && menu_categories_exists_by_slug($pdo, $nextId)) {
    Response::json(['ok' => false, 'error' => 'duplicate_slug'], 409);
    return;
  }

  if (menu_categories_has_duplicate_label($pdo, $nextLabel, $currentId)) {
    Response::json(['ok' => false, 'error' => 'duplicate_label'], 409);
    return;
  }

  $nextSortOrder = $hasSort
    ? menu_categories_parse_sort_order($input['sort_order'], (int) $existing['sort_order'])
    : (int) $existing['sort_order'];
  $nextActive = $hasActive
    ? menu_categories_parse_bool_flag($input['active'], (int) $existing['active'])
    : (int) $existing['active'];
  $nextVisible = $hasVisible
    ? menu_categories_parse_bool_flag($input['visible_in_menu'], (int) $existing['visible_in_menu'])
    : (int) $existing['visible_in_menu'];
  $flags = menu_categories_final_flags($nextActive, $nextVisible);

  $pdo->beginTransaction();

  $updateCategoryStmt = $pdo->prepare(
    'UPDATE menu_categories
     SET id = ?, label = ?, sort_order = ?, active = ?, visible_in_menu = ?
     WHERE id = ?'
  );
  $updateCategoryStmt->execute([
    $nextId,
    $nextLabel,
    $nextSortOrder,
    $flags['active'],
    $flags['visible_in_menu'],
    $currentId,
  ]);

  if ($nextId !== $currentId) {
    $updateProductsStmt = $pdo->prepare('UPDATE menu_products SET category = ? WHERE category = ?');
    $updateProductsStmt->execute([$nextId, $currentId]);
  }

  $pdo->commit();

  $row = menu_categories_fetch_one_with_counts($pdo, $nextId);
  Response::json([
    'ok' => true,
    'category' => $row ? menu_categories_format_row($row) : null,
  ]);
} catch (Throwable $error) {
  if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  Response::error('db_error', 500, $error);
}
