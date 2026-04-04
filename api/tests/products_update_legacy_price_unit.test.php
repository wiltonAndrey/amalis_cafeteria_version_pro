<?php
require __DIR__ . '/support/temp_db.php';

[$adminPdo, $pdo, $dbName] = temp_db_create('products_update_legacy_price_unit');

try {
  temp_db_create_legacy_menu_schema($pdo);
  $categoryId = 'legacy-update-cat';
  $pdo->prepare('INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)')
    ->execute([$categoryId, 'Categoria update legacy', 1]);

  $pdo->prepare(
    'INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )->execute([
    'Producto legacy base',
    3.50,
    $categoryId,
    'Base',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    1,
  ]);
  $productId = (int) $pdo->lastInsertId();

  require __DIR__ . '/../bootstrap.php';

  if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
  }

  $_SESSION['admin_id'] = 1;
  $_POST = [
    'id' => $productId,
    'price_unit' => 'kg',
  ];

  ob_start();
  require __DIR__ . '/../products/update.php';
  $json = ob_get_clean();
  $data = json_decode($json, true);

  if (($data['error'] ?? null) !== 'price_unit_requires_migration') {
    fwrite(STDERR, "FAIL: legacy update must fail explicitly when price_unit is sent before migration\n");
    exit(1);
  }

  $_POST = [
    'id' => $productId,
    'name' => 'Legacy sin unidad explicita',
  ];

  ob_start();
  require __DIR__ . '/../products/update.php';
  $json = ob_get_clean();
  $data = json_decode($json, true);

  if (empty($data['ok'])) {
    fwrite(STDERR, "FAIL: legacy update with omitted price_unit must remain a no-op for migration gating\n");
    exit(1);
  }

  $_POST = [
    'id' => $productId,
    'name' => 'Legacy unidad null',
    'price_unit' => null,
  ];

  ob_start();
  require __DIR__ . '/../products/update.php';
  $json = ob_get_clean();
  $data = json_decode($json, true);

  if (empty($data['ok'])) {
    fwrite(STDERR, "FAIL: legacy update with null price_unit must not require migration\n");
    exit(1);
  }

  $_POST = [
    'id' => $productId,
    'name' => 'Legacy unidad blank',
    'price_unit' => '',
  ];

  ob_start();
  require __DIR__ . '/../products/update.php';
  $json = ob_get_clean();
  $data = json_decode($json, true);

  if (empty($data['ok'])) {
    fwrite(STDERR, "FAIL: legacy update with blank price_unit must not require migration\n");
    exit(1);
  }

  $row = $pdo->prepare('SELECT name FROM menu_products WHERE id = ? LIMIT 1');
  $row->execute([$productId]);
  $product = $row->fetch();

  if (!$product || ($product['name'] ?? null) !== 'Legacy unidad blank') {
    fwrite(STDERR, "FAIL: legacy update no-op price_unit cases must still update other fields\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
