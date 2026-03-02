<?php
require __DIR__ . '/../utils/menu_taxonomy.php';

$subcategory = menu_taxonomy_derive_beverage_subcategory('Zumo de Naranja');
if ($subcategory !== 'zumos') {
  fwrite(STDERR, "FAIL: expected zumos, got {$subcategory}\n");
  exit(1);
}

$normalized = menu_taxonomy_normalize_product_taxonomy('Zumo de Naranja', 'bebidas', null);
if (($normalized['category'] ?? '') !== 'bebidas') {
  fwrite(STDERR, "FAIL: category should remain bebidas\n");
  exit(1);
}

if (($normalized['subcategory'] ?? '') !== 'zumos') {
  fwrite(STDERR, "FAIL: expected normalized subcategory zumos\n");
  exit(1);
}

echo "PASS\n";
