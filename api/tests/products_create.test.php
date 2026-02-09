<?php

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$_SESSION['admin_id'] = 1;

$_POST = [
  'name' => 'Producto Test',
  'price' => 10.50,
  'category' => 'cocas',
  'description' => 'Desc',
  'ingredients' => ['Harina'],
  'allergens' => ['Gluten'],
  'image' => '/images/sections/editada-01.webp',
];

ob_start();
require __DIR__ . '/../products/create.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['id'])) {
  fwrite(STDERR, "FAIL: missing id\n");
  exit(1);
}

echo "PASS\n";
