<?php
require __DIR__ . '/support/temp_db.php';

[$adminPdo, $pdo, $dbName] = temp_db_create('products_create_legacy_price_unit');

try {
  temp_db_create_legacy_menu_schema($pdo);
  $categoryId = 'legacy-create-cat';
  $pdo->prepare('INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)')
    ->execute([$categoryId, 'Categoria create legacy', 1]);

  require __DIR__ . '/../bootstrap.php';

  if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
  }

  $_SESSION['admin_id'] = 1;

  $_POST = [
    'name' => 'Producto legacy sin canonical',
    'price' => 4.25,
    'category' => $categoryId,
    'description' => 'Desc legacy',
    'ingredients' => ['Harina'],
    'allergens' => ['Gluten'],
    'image' => '/images/test.webp',
  ];

  ob_start();
  require __DIR__ . '/../products/create.php';
  $json = ob_get_clean();
  $data = json_decode($json, true);

  if (empty($data['id'])) {
    fwrite(STDERR, "FAIL: legacy create without price_unit should remain compatible\n");
    exit(1);
  }

  $_POST = [
    'name' => 'Producto legacy con canonical',
    'price' => 4.25,
    'price_unit' => 'kg',
    'category' => $categoryId,
    'description' => 'Desc legacy canonical',
    'ingredients' => ['Harina'],
    'allergens' => ['Gluten'],
    'image' => '/images/test.webp',
  ];

  ob_start();
  require __DIR__ . '/../products/create.php';
  $json = ob_get_clean();
  $data = json_decode($json, true);

  if (($data['error'] ?? null) !== 'price_unit_requires_migration') {
    fwrite(STDERR, "FAIL: legacy create must fail explicitly when price_unit is sent before migration\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
