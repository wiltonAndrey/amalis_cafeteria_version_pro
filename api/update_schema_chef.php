<?php
require __DIR__ . '/bootstrap.php';

try {
    $pdo = get_pdo();
    $statement = $pdo->query(
        "SELECT 1
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_products'
           AND COLUMN_NAME = 'chef_suggestion'"
    );

    if (!$statement->fetch()) {
        $pdo->exec("ALTER TABLE menu_products ADD COLUMN chef_suggestion TEXT NULL AFTER description");
        echo "Database schema updated successfully: Added 'chef_suggestion' column.\n";
    } else {
        echo "Column 'chef_suggestion' already exists.\n";
    }
} catch (Throwable $error) {
    fwrite(STDERR, "Failed to update schema: " . $error->getMessage() . "\n");
    exit(1);
}
