<?php
require __DIR__ . '/../bootstrap.php';

function normalize_list($value): array
{
  if (is_array($value)) {
    return array_values(array_filter(array_map('trim', $value), 'strlen'));
  }

  if (is_string($value) && $value !== '') {
    $decoded = json_decode($value, true);
    if (is_array($decoded)) {
      return array_values(array_filter(array_map('trim', $decoded), 'strlen'));
    }
    $parts = array_map('trim', explode(',', $value));
    return array_values(array_filter($parts, 'strlen'));
  }

  return [];
}

$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$input = array_merge($_POST, is_array($body) ? $body : []);

$name = Validator::string_trim($input['name'] ?? '');
$description = Validator::string_trim($input['description'] ?? '');
$category = Validator::string_trim($input['category'] ?? '');
$price = $input['price'] ?? null;

if (!Validator::required($name) || !Validator::required($description) || !Validator::required($category) || $price === null) {
  Response::json(['ok' => false, 'error' => 'missing_fields'], 400);
  return;
}

if (!Validator::positive($price)) {
  Response::json(['ok' => false, 'error' => 'invalid_price'], 400);
  return;
}

$image = Validator::string_trim($input['image'] ?? '');
if ($image === '') {
  $image = '/images/sections/editada-01.webp';
}

$altText = Validator::string_trim($input['alt_text'] ?? '');
$imageTitle = Validator::string_trim($input['image_title'] ?? '');
$chefSuggestion = Validator::string_trim($input['chef_suggestion'] ?? '');

$ingredients = normalize_list($input['ingredients'] ?? []);
$allergens = normalize_list($input['allergens'] ?? []);
$featured = !empty($input['featured']) ? 1 : 0;
$active = isset($input['active']) ? (int) ((bool) $input['active']) : 1;
$sortOrder = null;

if (array_key_exists('sort_order', $input) && $input['sort_order'] !== '' && $input['sort_order'] !== null) {
  if (filter_var($input['sort_order'], FILTER_VALIDATE_INT) === false || (int) $input['sort_order'] < 1) {
    Response::json(['ok' => false, 'error' => 'invalid_sort_order'], 400);
    return;
  }

  $sortOrder = (int) $input['sort_order'];
}

$pdo = null;

try {
  $pdo = get_pdo();
  $pdo->beginTransaction();
  $hasChefSuggestion = table_has_column($pdo, 'menu_products', 'chef_suggestion');

  $categoryCheck = $pdo->prepare('SELECT id FROM menu_categories WHERE id = ? LIMIT 1');
  $categoryCheck->execute([$category]);
  if (!$categoryCheck->fetch()) {
    $pdo->rollBack();
    Response::json(['ok' => false, 'error' => 'invalid_category'], 400);
    return;
  }

  normalize_menu_product_sort_orders($pdo, $category);
  $resolvedSortOrder = resolve_menu_product_sort_order($pdo, $category, $sortOrder);
  shift_menu_product_sort_orders($pdo, $category, $resolvedSortOrder);

  $insertColumns = 'name, price, category, description, image, alt_text, image_title, ingredients, allergens, featured, active, sort_order';
  $placeholders = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
  $params = [
    $name,
    (float) $price,
    $category,
    $description,
    $image,
    $altText,
    $imageTitle,
    json_encode($ingredients, JSON_UNESCAPED_UNICODE),
    json_encode($allergens, JSON_UNESCAPED_UNICODE),
    $featured,
    $active,
    $resolvedSortOrder,
  ];

  if ($hasChefSuggestion) {
    $insertColumns .= ', chef_suggestion';
    $placeholders .= ', ?';
    $params[] = $chefSuggestion;
  }

  $stmt = $pdo->prepare(
    "INSERT INTO menu_products ($insertColumns)
     VALUES ($placeholders)"
  );
  $stmt->execute($params);

  $createdId = (int) $pdo->lastInsertId();
  $pdo->commit();

  Response::json(['ok' => true, 'id' => $createdId], 201);
} catch (Throwable $error) {
  if ($pdo && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
