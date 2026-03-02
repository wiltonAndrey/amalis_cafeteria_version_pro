<?php

if (!function_exists('menu_categories_column_exists')) {
  function menu_categories_column_exists(PDO $pdo, string $column): bool
  {
    $stmt = $pdo->prepare(
      "SELECT 1
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'menu_categories'
         AND COLUMN_NAME = ?
       LIMIT 1"
    );
    $stmt->execute([$column]);
    return (bool) $stmt->fetchColumn();
  }
}

if (!function_exists('menu_categories_ensure_schema')) {
  function menu_categories_ensure_schema(PDO $pdo): array
  {
    $activeAdded = false;
    $visibleAdded = false;

    if (!menu_categories_column_exists($pdo, 'active')) {
      $pdo->exec("ALTER TABLE menu_categories ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1 AFTER sort_order");
      $activeAdded = true;
    }

    if (!menu_categories_column_exists($pdo, 'visible_in_menu')) {
      $pdo->exec("ALTER TABLE menu_categories ADD COLUMN visible_in_menu TINYINT(1) NOT NULL DEFAULT 1 AFTER active");
      $visibleAdded = true;
    }

    if ($activeAdded || $visibleAdded) {
      // "Ofertas" se conserva en BD pero queda desactivada/oculta en la carta pÃºblica.
      $pdo->exec("UPDATE menu_categories SET active = 0, visible_in_menu = 0 WHERE id = 'ofertas'");
      $pdo->exec("UPDATE menu_categories SET active = 1, visible_in_menu = 1 WHERE id = 'all'");
      $pdo->exec("UPDATE menu_categories SET visible_in_menu = 1 WHERE id = 'bebidas'");
    }

    return [
      'active_added' => $activeAdded,
      'visible_in_menu_added' => $visibleAdded,
    ];
  }
}

if (!function_exists('menu_categories_read_request_input')) {
  function menu_categories_read_request_input(): array
  {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    return array_merge($_POST, is_array($body) ? $body : []);
  }
}

if (!function_exists('menu_categories_slugify')) {
  function menu_categories_slugify(string $value): string
  {
    if (function_exists('menu_taxonomy_slugify')) {
      return menu_taxonomy_slugify($value);
    }

    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '_', $value) ?? $value;
    return trim($value, '_');
  }
}

if (!function_exists('menu_categories_normalize_slug')) {
  function menu_categories_normalize_slug($value): string
  {
    return menu_categories_slugify((string) ($value ?? ''));
  }
}

if (!function_exists('menu_categories_normalize_label')) {
  function menu_categories_normalize_label($value): string
  {
    return trim((string) ($value ?? ''));
  }
}

if (!function_exists('menu_categories_parse_bool_flag')) {
  function menu_categories_parse_bool_flag($value, int $default = 1): int
  {
    if ($value === null || $value === '') {
      return $default ? 1 : 0;
    }

    if (is_bool($value)) {
      return $value ? 1 : 0;
    }

    if (is_numeric($value)) {
      return ((int) $value) ? 1 : 0;
    }

    $text = strtolower(trim((string) $value));
    if ($text === '') {
      return $default ? 1 : 0;
    }

    return in_array($text, ['1', 'true', 'yes', 'si', 'on'], true) ? 1 : 0;
  }
}

if (!function_exists('menu_categories_parse_sort_order')) {
  function menu_categories_parse_sort_order($value, int $default = 0): int
  {
    if (is_numeric($value)) {
      return (int) $value;
    }

    return $default;
  }
}

if (!function_exists('menu_categories_validate_slug')) {
  function menu_categories_validate_slug(string $slug): ?string
  {
    if ($slug === '') {
      return 'invalid_slug';
    }

    if (strlen($slug) > 32) {
      return 'slug_too_long';
    }

    if (!preg_match('/^[a-z0-9_]+$/', $slug)) {
      return 'invalid_slug';
    }

    return null;
  }
}

if (!function_exists('menu_categories_validate_label')) {
  function menu_categories_validate_label(string $label): ?string
  {
    if ($label === '') {
      return 'invalid_label';
    }

    if (strlen($label) > 64) {
      return 'label_too_long';
    }

    return null;
  }
}

if (!function_exists('menu_categories_is_reserved_slug')) {
  function menu_categories_is_reserved_slug(string $slug): bool
  {
    return $slug === 'all';
  }
}

if (!function_exists('menu_categories_is_protected_slug_rename')) {
  function menu_categories_is_protected_slug_rename(string $currentSlug, string $nextSlug): bool
  {
    if ($currentSlug === $nextSlug) {
      return false;
    }

    // La lÃ³gica especial de bebidas depende del slug "bebidas".
    return $currentSlug === 'bebidas';
  }
}

if (!function_exists('menu_categories_exists_by_slug')) {
  function menu_categories_exists_by_slug(PDO $pdo, string $slug): bool
  {
    $stmt = $pdo->prepare('SELECT 1 FROM menu_categories WHERE id = ? LIMIT 1');
    $stmt->execute([$slug]);
    return (bool) $stmt->fetchColumn();
  }
}

if (!function_exists('menu_categories_has_duplicate_label')) {
  function menu_categories_has_duplicate_label(PDO $pdo, string $label, ?string $excludeId = null): bool
  {
    if ($excludeId !== null && $excludeId !== '') {
      $stmt = $pdo->prepare(
        'SELECT 1
         FROM menu_categories
         WHERE LOWER(label) = LOWER(?)
           AND id <> ?
         LIMIT 1'
      );
      $stmt->execute([$label, $excludeId]);
      return (bool) $stmt->fetchColumn();
    }

    $stmt = $pdo->prepare(
      'SELECT 1
       FROM menu_categories
       WHERE LOWER(label) = LOWER(?)
       LIMIT 1'
    );
    $stmt->execute([$label]);
    return (bool) $stmt->fetchColumn();
  }
}

if (!function_exists('menu_categories_next_sort_order')) {
  function menu_categories_next_sort_order(PDO $pdo): int
  {
    $value = $pdo->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM menu_categories')->fetchColumn();
    return is_numeric($value) ? (int) $value : 1;
  }
}

if (!function_exists('menu_categories_fetch_one_with_counts')) {
  function menu_categories_fetch_one_with_counts(PDO $pdo, string $id): ?array
  {
    $stmt = $pdo->prepare(
      "SELECT
         mc.id,
         mc.label,
         mc.sort_order,
         mc.active,
         mc.visible_in_menu,
         COUNT(mp.id) AS product_count_total,
         COALESCE(SUM(CASE WHEN mp.active = 1 THEN 1 ELSE 0 END), 0) AS product_count_active
       FROM menu_categories mc
       LEFT JOIN menu_products mp ON mp.category = mc.id
       WHERE mc.id = ?
       GROUP BY mc.id, mc.label, mc.sort_order, mc.active, mc.visible_in_menu
       LIMIT 1"
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
  }
}

if (!function_exists('menu_categories_format_row')) {
  function menu_categories_format_row(array $row): array
  {
    $id = (string) ($row['id'] ?? '');
    return [
      'id' => $id,
      'slug' => $id,
      'label' => (string) ($row['label'] ?? ''),
      'sort_order' => (int) ($row['sort_order'] ?? 0),
      'active' => (bool) ($row['active'] ?? false),
      'visible_in_menu' => (bool) ($row['visible_in_menu'] ?? false),
      'product_count_total' => isset($row['product_count_total']) ? (int) $row['product_count_total'] : null,
      'product_count_active' => isset($row['product_count_active']) ? (int) $row['product_count_active'] : null,
      'is_system' => $id === 'all',
    ];
  }
}

if (!function_exists('menu_categories_list_admin')) {
  function menu_categories_list_admin(PDO $pdo): array
  {
    $rows = $pdo->query(
      "SELECT
         mc.id,
         mc.label,
         mc.sort_order,
         mc.active,
         mc.visible_in_menu,
         COUNT(mp.id) AS product_count_total,
         COALESCE(SUM(CASE WHEN mp.active = 1 THEN 1 ELSE 0 END), 0) AS product_count_active
       FROM menu_categories mc
       LEFT JOIN menu_products mp ON mp.category = mc.id
       GROUP BY mc.id, mc.label, mc.sort_order, mc.active, mc.visible_in_menu
       ORDER BY CASE WHEN mc.id = 'all' THEN -1 ELSE mc.sort_order END, mc.id"
    )->fetchAll();

    return array_map('menu_categories_format_row', $rows ?: []);
  }
}

if (!function_exists('menu_categories_final_flags')) {
  function menu_categories_final_flags(int $active, int $visibleInMenu): array
  {
    if ($active === 0) {
      $visibleInMenu = 0;
    }

    return [
      'active' => $active ? 1 : 0,
      'visible_in_menu' => $visibleInMenu ? 1 : 0,
    ];
  }
}

if (!function_exists('menu_categories_parse_reorder_items')) {
  function menu_categories_parse_reorder_items($items): array
  {
    if (is_string($items) && $items !== '') {
      $decoded = json_decode($items, true);
      if (is_array($decoded)) {
        $items = $decoded;
      }
    }

    if (!is_array($items)) {
      return [];
    }

    $result = [];
    foreach ($items as $item) {
      if (!is_array($item)) {
        continue;
      }

      $id = menu_categories_normalize_slug($item['id'] ?? '');
      if ($id === '') {
        continue;
      }

      $result[] = [
        'id' => $id,
        'sort_order' => menu_categories_parse_sort_order($item['sort_order'] ?? null, 0),
      ];
    }

    return $result;
  }
}
