<?php
ob_start();
require __DIR__ . '/../get_products.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data)) {
  fwrite(STDERR, "FAIL: invalid JSON\n");
  exit(1);
}

if (empty($data['menuCategories']) || empty($data['menuProducts'])) {
  fwrite(STDERR, "FAIL: missing menu data\n");
  exit(1);
}

if (empty($data['featuredProducts'])) {
  fwrite(STDERR, "FAIL: missing featured products\n");
  exit(1);
}

echo "PASS\n";
