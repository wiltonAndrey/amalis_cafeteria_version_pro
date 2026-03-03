<?php
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/promotions/list.php';

$pdo = get_pdo();

$categories = $pdo->query(
  'SELECT id, label FROM menu_categories ORDER BY sort_order, id'
)->fetchAll();

$hasChefSuggestion = table_has_column($pdo, 'menu_products', 'chef_suggestion');
$chefSuggestionSelect = $hasChefSuggestion
  ? ', menu_products.chef_suggestion'
  : ", '' AS chef_suggestion";

$menuRows = $pdo->query(
  'SELECT menu_products.id, menu_products.name, menu_products.price, menu_products.category, menu_products.sort_order,
          menu_products.description, menu_products.image, menu_products.alt_text, menu_products.image_title,
          menu_products.ingredients, menu_products.allergens, menu_products.featured' . $chefSuggestionSelect . '
   FROM menu_products
   LEFT JOIN menu_categories AS category_meta ON category_meta.id = menu_products.category
   WHERE menu_products.active = 1
   ORDER BY COALESCE(category_meta.sort_order, 9999), menu_products.sort_order, menu_products.id'
)->fetchAll();

$menuProducts = array_map(function (array $row): array {
  return [
    'id' => (string) $row['id'],
    'name' => $row['name'],
    'price' => (float) $row['price'],
    'category' => $row['category'],
    'sort_order' => (int) $row['sort_order'],
    'description' => $row['description'],
    'chef_suggestion' => $row['chef_suggestion'] ?? '',
    'image' => $row['image'],
    'alt_text' => $row['alt_text'] ?? '',
    'image_title' => $row['image_title'] ?? '',
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
  'promotionCards' => promotions_list_cards($pdo),
], JSON_UNESCAPED_UNICODE);
