<?php
require __DIR__ . '/../bootstrap.php';

if (!function_exists('find_bizcocho_price_unit_candidates')) {
  function find_bizcocho_price_unit_candidates(PDO $pdo): array
  {
    $categories = ['bolleria-dulce', 'pasteleria', 'bizcochos', 'pasteles', 'bolleria_dulce', 'bolleria'];
    $placeholders = implode(', ', array_fill(0, count($categories), '?'));
    $stmt = $pdo->prepare(
      "SELECT id, name, category, price_unit
       FROM menu_products
       WHERE active = 1
         AND price_unit = 'unit'
         AND name LIKE 'Bizcocho%'
         AND category IN ($placeholders)
       ORDER BY category, sort_order, id"
    );
    $stmt->execute($categories);

    return $stmt->fetchAll();
  }
}

if (!function_exists('menu_products_has_price_unit_column')) {
  function menu_products_has_price_unit_column(PDO $pdo): bool
  {
    $stmt = $pdo->query(
      "SELECT COUNT(*)
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'menu_products'
         AND COLUMN_NAME = 'price_unit'"
    );

    return (int) $stmt->fetchColumn() > 0;
  }
}

if (!function_exists('repair_bizcocho_price_unit')) {
  function repair_bizcocho_price_unit(PDO $pdo, bool $apply = false): array
  {
    if (!menu_products_has_price_unit_column($pdo)) {
      throw new RuntimeException('menu_products.price_unit no existe en esta base de datos');
    }

    $before = find_bizcocho_price_unit_candidates($pdo);
    $updated = 0;

    if ($apply && !empty($before)) {
      $pdo->beginTransaction();

      try {
        $ids = array_map(static fn(array $row): int => (int) $row['id'], $before);
        $placeholders = implode(', ', array_fill(0, count($ids), '?'));
        $update = $pdo->prepare(
          "UPDATE menu_products
           SET price_unit = 'kg'
           WHERE id IN ($placeholders)"
        );
        $update->execute($ids);
        $updated = $update->rowCount();
        $pdo->commit();
      } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
          $pdo->rollBack();
        }

        throw $error;
      }
    }

    $afterStmt = $pdo->prepare(
      "SELECT id, name, category, price_unit
       FROM menu_products
       WHERE active = 1
         AND name LIKE 'Bizcocho%'
         AND category IN ('bolleria-dulce', 'pasteleria', 'bizcochos', 'pasteles', 'bolleria_dulce', 'bolleria')
       ORDER BY category, sort_order, id"
    );
    $afterStmt->execute();

    return [
      'ok' => true,
      'mode' => $apply ? 'apply' : 'dry-run',
      'matching_rows_before' => count($before),
      'updated_rows' => $updated,
      'before' => $before,
      'after' => $afterStmt->fetchAll(),
    ];
  }
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
  $apply = in_array('--apply', $argv ?? [], true);

  try {
    $result = repair_bizcocho_price_unit(get_pdo(), $apply);
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
  } catch (Throwable $error) {
    fwrite(STDERR, "FAIL: {$error->getMessage()}\n");
    exit(1);
  }
}
