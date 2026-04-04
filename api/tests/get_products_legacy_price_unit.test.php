<?php
require __DIR__ . '/support/temp_db.php';

[$adminPdo, $pdo, $dbName] = temp_db_create('get_products_legacy_price_unit');

try {
  temp_db_create_legacy_menu_schema($pdo);
  temp_db_seed_get_products_dependencies($pdo);

  $categoryId = 'legacy-cat';
  $pdo->prepare('INSERT INTO menu_categories (id, label, sort_order, active, visible_in_menu) VALUES (?, ?, ?, 1, 1)')
    ->execute([$categoryId, 'Categoria legacy', 1]);

  $pdo->prepare(
    'INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )->execute([
    'Bizcocho legacy',
    26.00,
    $categoryId,
    'Descripcion legacy',
    '/images/test.webp',
    json_encode(['Harina'], JSON_UNESCAPED_UNICODE),
    json_encode(['Gluten'], JSON_UNESCAPED_UNICODE),
    0,
    1,
    1,
  ]);

  require __DIR__ . '/../bootstrap.php';

  ob_start();
  require __DIR__ . '/../get_products.php';
  $json = ob_get_clean();

  $data = json_decode($json, true);
  if (!is_array($data) || empty($data['menuProducts'])) {
    fwrite(STDERR, "FAIL: invalid get_products payload on legacy schema\n");
    exit(1);
  }

  $product = null;
  foreach ($data['menuProducts'] as $candidate) {
    if (($candidate['name'] ?? '') === 'Bizcocho legacy') {
      $product = $candidate;
      break;
    }
  }

  if (!$product) {
    fwrite(STDERR, "FAIL: legacy product missing from get_products payload\n");
    exit(1);
  }

  if (array_key_exists('price_unit', $product)) {
    fwrite(STDERR, "FAIL: get_products fabricated canonical price_unit on legacy schema\n");
    exit(1);
  }

  echo "PASS\n";
} finally {
  temp_db_drop($adminPdo, $dbName);
}
