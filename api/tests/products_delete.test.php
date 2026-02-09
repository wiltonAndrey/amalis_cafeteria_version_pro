<?php

$config = require __DIR__ . '/../db_config.php';
$dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['name']);
$pdo = new PDO($dsn, $config['user'], $config['pass'], [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$pdo->exec(
  "INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
   VALUES (
     'Producto A Borrar',
     2.25,
     'cocas',
     'Descripcion temporal',
     '/images/sections/editada-01.webp',
     JSON_ARRAY('Harina'),
     JSON_ARRAY('Gluten'),
     0,
     1,
     9998
   )"
);
$productId = (int) $pdo->lastInsertId();

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$_SESSION['admin_id'] = 1;

$_POST = [
  'id' => $productId,
];

ob_start();
require __DIR__ . '/../products/delete.php';
$json = ob_get_clean();
$data = json_decode($json, true);

if (empty($data['ok'])) {
  fwrite(STDERR, "FAIL: delete failed\n");
  exit(1);
}

echo "PASS\n";
