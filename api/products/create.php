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

$ingredients = normalize_list($input['ingredients'] ?? []);
$allergens = normalize_list($input['allergens'] ?? []);
$featured = !empty($input['featured']) ? 1 : 0;
$active = isset($input['active']) ? (int) ((bool) $input['active']) : 1;
$sortOrder = isset($input['sort_order']) && is_numeric($input['sort_order'])
  ? (int) $input['sort_order']
  : 0;

$pdo = null;

try {
  $pdo = get_pdo();
  $pdo->beginTransaction();

  $categoryCheck = $pdo->prepare('SELECT id FROM menu_categories WHERE id = ? LIMIT 1');
  $categoryCheck->execute([$category]);
  if (!$categoryCheck->fetch()) {
    $pdo->rollBack();
    Response::json(['ok' => false, 'error' => 'invalid_category'], 400);
    return;
  }

  $stmt = $pdo->prepare(
    'INSERT INTO menu_products (name, price, category, description, image, alt_text, image_title, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  $stmt->execute([
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
    $sortOrder,
  ]);

  $createdId = (int) $pdo->lastInsertId();
  $pdo->commit();

  Response::json(['ok' => true, 'id' => $createdId], 201);
} catch (Throwable $error) {
  if ($pdo && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
