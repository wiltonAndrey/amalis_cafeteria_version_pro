<?php
require __DIR__ . '/bootstrap.php';

try {
    $pdo = get_pdo();
    if (!table_has_column($pdo, 'menu_products', 'price_unit')) {
        $pdo->exec("ALTER TABLE menu_products ADD COLUMN price_unit VARCHAR(8) NULL DEFAULT NULL AFTER price");
        echo "Database schema updated successfully: Added 'price_unit' column.\n";
    } else {
        echo "Column 'price_unit' already exists.\n";
    }

    $pdo->exec("ALTER TABLE menu_products MODIFY COLUMN price_unit VARCHAR(8) NULL DEFAULT NULL");
    $pdo->exec("UPDATE menu_products SET price_unit = NULL WHERE TRIM(COALESCE(price_unit, '')) = '' OR price_unit NOT IN ('unit', 'kg')");
} catch (Throwable $error) {
    fwrite(STDERR, "Failed to update schema: " . $error->getMessage() . "\n");
    exit(1);
}
