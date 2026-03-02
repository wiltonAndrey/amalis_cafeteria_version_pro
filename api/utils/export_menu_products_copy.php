<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();

$rows = $pdo->query(
  'SELECT id, name, category, subcategory, price, image, description, alt_text, image_title, chef_suggestion, ingredients, allergens, featured, sort_order
   FROM menu_products
   WHERE active = 1
   ORDER BY sort_order, id'
)->fetchAll();

$payload = array_map(static function (array $row): array {
  return [
    'id' => (int) $row['id'],
    'name' => $row['name'],
    'category' => $row['category'],
    'subcategory' => $row['subcategory'],
    'price' => (float) $row['price'],
    'image' => $row['image'],
    'description' => $row['description'],
    'alt_text' => $row['alt_text'],
    'image_title' => $row['image_title'],
    'chef_suggestion' => $row['chef_suggestion'],
    'ingredients' => json_decode((string) $row['ingredients'], true) ?: [],
    'allergens' => json_decode((string) $row['allergens'], true) ?: [],
    'featured' => (bool) $row['featured'],
    'sort_order' => (int) $row['sort_order'],
  ];
}, $rows);

$json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($json === false) {
  fwrite(STDERR, "FAIL: could not encode export payload\n");
  exit(1);
}

$outputPath = $argv[1] ?? null;
if ($outputPath) {
  $fullPath = $outputPath;
  if (!preg_match('/^[A-Za-z]:\\\\|^\//', $outputPath)) {
    $fullPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $outputPath);
  }

  $dir = dirname($fullPath);
  if (!is_dir($dir) && !mkdir($dir, 0777, true) && !is_dir($dir)) {
    fwrite(STDERR, "FAIL: could not create export directory\n");
    exit(1);
  }

  if (file_put_contents($fullPath, $json . PHP_EOL) === false) {
    fwrite(STDERR, "FAIL: could not write export file\n");
    exit(1);
  }

  echo json_encode([
    'ok' => true,
    'output' => $fullPath,
    'products' => count($payload),
  ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit(0);
}

echo $json;
