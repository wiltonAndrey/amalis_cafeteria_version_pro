<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

$categories = $pdo->query(
  'SELECT id, label FROM menu_categories ORDER BY sort_order, id'
)->fetchAll();

$menuRows = $pdo->query(
  'SELECT id, name, price, category, description, image, ingredients, allergens, featured
   FROM menu_products
   WHERE active = 1
   ORDER BY sort_order, id'
)->fetchAll();

$menuProducts = array_map(function (array $row): array {
  return [
    'id' => (string) $row['id'],
    'name' => $row['name'],
    'price' => (float) $row['price'],
    'category' => $row['category'],
    'description' => $row['description'],
    'image' => $row['image'],
    'ingredients' => json_decode($row['ingredients'], true) ?: [],
    'allergens' => json_decode($row['allergens'], true) ?: [],
    'featured' => (bool) $row['featured'],
  ];
}, $menuRows);

$featuredRows = $pdo->query(
  'SELECT id, name, description, price_text, category, image_url, image_alt
   FROM products
   WHERE active = 1
   ORDER BY sort_order, id'
)->fetchAll();

$featuredProducts = array_map(function (array $row): array {
  return [
    'id' => (string) $row['id'],
    'name' => $row['name'],
    'description' => $row['description'],
    'price' => $row['price_text'],
    'category' => $row['category'],
    'imageUrl' => $row['image_url'],
    'imageAlt' => $row['image_alt'],
  ];
}, $featuredRows);

echo json_encode([
  'menuCategories' => $categories,
  'menuProducts' => $menuProducts,
  'featuredProducts' => $featuredProducts,
], JSON_UNESCAPED_UNICODE);
