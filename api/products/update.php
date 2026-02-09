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

$id = isset($input['id']) ? (int) $input['id'] : 0;
if ($id <= 0) {
  Response::json(['ok' => false, 'error' => 'missing_id'], 400);
  return;
}

$fields = [];
$params = [];

if (array_key_exists('name', $input)) {
  $name = Validator::string_trim($input['name']);
  if (!Validator::required($name)) {
    Response::json(['ok' => false, 'error' => 'invalid_name'], 400);
    return;
  }
  $fields[] = 'name = ?';
  $params[] = $name;
}

if (array_key_exists('price', $input)) {
  $price = $input['price'];
  if (!Validator::positive($price)) {
    Response::json(['ok' => false, 'error' => 'invalid_price'], 400);
    return;
  }
  $fields[] = 'price = ?';
  $params[] = (float) $price;
}

if (array_key_exists('category', $input)) {
  $category = Validator::string_trim($input['category']);
  if (!Validator::required($category)) {
    Response::json(['ok' => false, 'error' => 'invalid_category'], 400);
    return;
  }
  $fields[] = 'category = ?';
  $params[] = $category;
}

if (array_key_exists('description', $input)) {
  $description = Validator::string_trim($input['description']);
  if (!Validator::required($description)) {
    Response::json(['ok' => false, 'error' => 'invalid_description'], 400);
    return;
  }
  $fields[] = 'description = ?';
  $params[] = $description;
}

if (array_key_exists('image', $input)) {
  $image = Validator::string_trim($input['image']);
  if ($image === '') {
    $image = '/images/sections/editada-01.webp';
  }
  $fields[] = 'image = ?';
  $params[] = $image;
}

if (array_key_exists('alt_text', $input)) {
  $altText = Validator::string_trim($input['alt_text']);
  $fields[] = 'alt_text = ?';
  $params[] = $altText;
}

if (array_key_exists('image_title', $input)) {
  $imageTitle = Validator::string_trim($input['image_title']);
  $fields[] = 'image_title = ?';
  $params[] = $imageTitle;
}

if (array_key_exists('ingredients', $input)) {
  $ingredients = normalize_list($input['ingredients']);
  $fields[] = 'ingredients = ?';
  $params[] = json_encode($ingredients, JSON_UNESCAPED_UNICODE);
}

if (array_key_exists('allergens', $input)) {
  $allergens = normalize_list($input['allergens']);
  $fields[] = 'allergens = ?';
  $params[] = json_encode($allergens, JSON_UNESCAPED_UNICODE);
}

if (array_key_exists('featured', $input)) {
  $fields[] = 'featured = ?';
  $params[] = !empty($input['featured']) ? 1 : 0;
}

if (array_key_exists('active', $input)) {
  $fields[] = 'active = ?';
  $params[] = !empty($input['active']) ? 1 : 0;
}

if (array_key_exists('sort_order', $input) && is_numeric($input['sort_order'])) {
  $fields[] = 'sort_order = ?';
  $params[] = (int) $input['sort_order'];
}

if (empty($fields)) {
  Response::json(['ok' => false, 'error' => 'no_fields'], 400);
  return;
}

try {
  $pdo = get_pdo();
  $exists = $pdo->prepare('SELECT id, active FROM menu_products WHERE id = ? LIMIT 1');
  $exists->execute([$id]);
  $row = $exists->fetch();
  if (!$row || (int) $row['active'] === 0) {
    Response::json(['ok' => false, 'error' => 'not_found'], 404);
    return;
  }

  if (array_key_exists('category', $input)) {
    $categoryValue = Validator::string_trim($input['category']);
    $categoryCheck = $pdo->prepare('SELECT id FROM menu_categories WHERE id = ? LIMIT 1');
    $categoryCheck->execute([$categoryValue]);
    if (!$categoryCheck->fetch()) {
      Response::json(['ok' => false, 'error' => 'invalid_category'], 400);
      return;
    }
  }

  $params[] = $id;
  $stmt = $pdo->prepare('UPDATE menu_products SET ' . implode(', ', $fields) . ' WHERE id = ?');
  $stmt->execute($params);

  Response::json(['ok' => true, 'updated' => $stmt->rowCount()]);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
