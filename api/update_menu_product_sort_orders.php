<?php

require __DIR__ . '/bootstrap.php';

try {
  $pdo = get_pdo();
  $pdo->beginTransaction();

  $categories = $pdo->query(
    "SELECT menu_products.category,
            MIN(COALESCE(menu_categories.sort_order, 9999)) AS category_sort_order
     FROM menu_products
     LEFT JOIN menu_categories ON menu_categories.id = menu_products.category
     WHERE menu_products.active = 1
     GROUP BY menu_products.category
     ORDER BY category_sort_order, menu_products.category"
  )->fetchAll(PDO::FETCH_COLUMN);

  foreach ($categories as $category) {
    normalize_menu_product_sort_orders($pdo, (string) $category);
  }

  $pdo->commit();
  echo "Menu product sort_order normalized by category.\n";
} catch (Throwable $error) {
  if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
    $pdo->rollBack();
  }

  fwrite(STDERR, "Failed to normalize menu product sort_order.\n");
  exit(1);
}
