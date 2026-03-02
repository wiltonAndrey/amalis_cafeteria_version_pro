<?php
require __DIR__ . '/../bootstrap.php';

$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

if (!api_require_request_guard('categories_create', 40, 60)) {
  return;
}

$input = menu_categories_read_request_input();
$label = menu_categories_normalize_label($input['label'] ?? '');
$labelError = menu_categories_validate_label($label);
if ($labelError !== null) {
  Response::json(['ok' => false, 'error' => $labelError], 400);
  return;
}

$slugInput = array_key_exists('slug', $input) ? $input['slug'] : $label;
$slug = menu_categories_normalize_slug($slugInput);
$slugError = menu_categories_validate_slug($slug);
if ($slugError !== null) {
  Response::json(['ok' => false, 'error' => $slugError], 400);
  return;
}

if (menu_categories_is_reserved_slug($slug)) {
  Response::json(['ok' => false, 'error' => 'reserved_slug'], 400);
  return;
}

try {
  $pdo = get_pdo();
  menu_categories_ensure_schema($pdo);

  if (menu_categories_exists_by_slug($pdo, $slug)) {
    Response::json(['ok' => false, 'error' => 'duplicate_slug'], 409);
    return;
  }

  if (menu_categories_has_duplicate_label($pdo, $label)) {
    Response::json(['ok' => false, 'error' => 'duplicate_label'], 409);
    return;
  }

  $sortOrder = array_key_exists('sort_order', $input)
    ? menu_categories_parse_sort_order($input['sort_order'], 0)
    : menu_categories_next_sort_order($pdo);
  $active = menu_categories_parse_bool_flag($input['active'] ?? null, 1);
  $visibleInMenu = menu_categories_parse_bool_flag($input['visible_in_menu'] ?? null, 1);
  $flags = menu_categories_final_flags($active, $visibleInMenu);

  $stmt = $pdo->prepare(
    'INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu)
     VALUES (?, ?, ?, ?, ?)'
  );
  $stmt->execute([
    $slug,
    $label,
    $sortOrder,
    $flags['active'],
    $flags['visible_in_menu'],
  ]);

  $row = menu_categories_fetch_one_with_counts($pdo, $slug);
  Response::json([
    'ok' => true,
    'category' => $row ? menu_categories_format_row($row) : null,
  ], 201);
} catch (Throwable $error) {
  Response::error('db_error', 500, $error);
}
