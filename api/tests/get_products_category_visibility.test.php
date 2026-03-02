<?php

ob_start();
require __DIR__ . '/../update_schema_menu_taxonomy.php';
ob_end_clean();

$pdo = get_pdo();

$existsStmt = $pdo->prepare('SELECT id, active, visible_in_menu FROM menu_categories WHERE id = ? LIMIT 1');
$existsStmt->execute(['ofertas']);
$ofertasRow = $existsStmt->fetch();

if (!$ofertasRow) {
  fwrite(STDERR, "FAIL: ofertas category does not exist in DB\n");
  exit(1);
}

if ((int) ($ofertasRow['active'] ?? 1) !== 0 || (int) ($ofertasRow['visible_in_menu'] ?? 1) !== 0) {
  fwrite(STDERR, "FAIL: ofertas should remain disabled/hidden in DB\n");
  exit(1);
}

ob_start();
require __DIR__ . '/../get_products.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (!is_array($data)) {
  fwrite(STDERR, "FAIL: invalid JSON response\n");
  exit(1);
}

$categories = is_array($data['menuCategories'] ?? null) ? $data['menuCategories'] : [];
$products = is_array($data['menuProducts'] ?? null) ? $data['menuProducts'] : [];

$ofertasFound = false;
foreach ($categories as $category) {
  if (($category['id'] ?? '') === 'ofertas') {
    $ofertasFound = true;
    break;
  }
}

if ($ofertasFound) {
  fwrite(STDERR, "FAIL: ofertas category should be hidden from public menuCategories\n");
  exit(1);
}

foreach ($products as $product) {
  if (($product['category'] ?? '') === 'ofertas') {
    fwrite(STDERR, "FAIL: ofertas products should be hidden from public menuProducts\n");
    exit(1);
  }
}

$bebidasFound = false;
$bebidasProductFound = false;
foreach ($categories as $category) {
  if (($category['id'] ?? '') === 'bebidas') {
    $bebidasFound = true;
    break;
  }
}
foreach ($products as $product) {
  if (($product['category'] ?? '') === 'bebidas') {
    $bebidasProductFound = true;
    break;
  }
}

if (!$bebidasFound || !$bebidasProductFound) {
  fwrite(STDERR, "FAIL: bebidas should remain visible in public menu\n");
  exit(1);
}

$existsStmt->execute(['ofertas']);
$ofertasStillExists = $existsStmt->fetch();
if (!$ofertasStillExists) {
  fwrite(STDERR, "FAIL: ofertas category was removed from DB unexpectedly\n");
  exit(1);
}

echo "PASS\n";
