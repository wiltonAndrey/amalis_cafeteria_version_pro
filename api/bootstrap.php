<?php
$config = require __DIR__ . '/db_config.php';

if (!function_exists('get_pdo')) {
  function get_pdo(): PDO
  {
    static $pdo = null;
    if ($pdo) {
      return $pdo;
    }

    $config = $GLOBALS['config'] ?? require __DIR__ . '/db_config.php';

    $dsn = sprintf(
      'mysql:host=%s;dbname=%s;charset=utf8mb4',
      $config['host'],
      $config['name']
    );

    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
  }
}

if (!function_exists('table_has_column')) {
  function table_has_column(PDO $pdo, string $table, string $column): bool
  {
    static $tableColumns = [];

    if (!array_key_exists($table, $tableColumns)) {
      $rows = $pdo->query(sprintf('SHOW COLUMNS FROM `%s`', str_replace('`', '``', $table)))->fetchAll();
      $tableColumns[$table] = array_map(
        static fn(array $row): string => (string) ($row['Field'] ?? ''),
        $rows
      );
    }

    return in_array($column, $tableColumns[$table], true);
  }
}

if (!function_exists('normalize_menu_product_sort_orders')) {
  function normalize_menu_product_sort_orders(PDO $pdo, string $category, ?int $excludeProductId = null): void
  {
    $sql = 'SELECT id FROM menu_products WHERE active = 1 AND category = ?';
    $params = [$category];

    if ($excludeProductId !== null) {
      $sql .= ' AND id <> ?';
      $params[] = $excludeProductId;
    }

    $sql .= ' ORDER BY sort_order, id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($ids)) {
      return;
    }

    $update = $pdo->prepare('UPDATE menu_products SET sort_order = ? WHERE id = ?');

    foreach ($ids as $index => $id) {
      $update->execute([$index + 1, (int) $id]);
    }
  }
}

if (!function_exists('count_active_menu_products_in_category')) {
  function count_active_menu_products_in_category(PDO $pdo, string $category, ?int $excludeProductId = null): int
  {
    $sql = 'SELECT COUNT(*) FROM menu_products WHERE active = 1 AND category = ?';
    $params = [$category];

    if ($excludeProductId !== null) {
      $sql .= ' AND id <> ?';
      $params[] = $excludeProductId;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return (int) $stmt->fetchColumn();
  }
}

if (!function_exists('resolve_menu_product_sort_order')) {
  function resolve_menu_product_sort_order(
    PDO $pdo,
    string $category,
    ?int $requestedSortOrder,
    ?int $excludeProductId = null
  ): int {
    $count = count_active_menu_products_in_category($pdo, $category, $excludeProductId);
    $maxPosition = $count + 1;

    if ($requestedSortOrder === null) {
      return $maxPosition;
    }

    if ($requestedSortOrder < 1) {
      return 1;
    }

    if ($requestedSortOrder > $maxPosition) {
      return $maxPosition;
    }

    return $requestedSortOrder;
  }
}

if (!function_exists('shift_menu_product_sort_orders')) {
  function shift_menu_product_sort_orders(
    PDO $pdo,
    string $category,
    int $fromPosition,
    ?int $excludeProductId = null
  ): void {
    $sql = 'UPDATE menu_products SET sort_order = sort_order + 1 WHERE active = 1 AND category = ? AND sort_order >= ?';
    $params = [$category, $fromPosition];

    if ($excludeProductId !== null) {
      $sql .= ' AND id <> ?';
      $params[] = $excludeProductId;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
  }
}

if (php_sapi_name() !== 'cli') {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Validator.php';
require_once __DIR__ . '/middleware/Auth.php';
