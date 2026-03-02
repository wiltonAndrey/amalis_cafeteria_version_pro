<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

try {
    $stmt = $pdo->query(
        "SELECT COUNT(*) AS total
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_products'
           AND COLUMN_NAME = 'chef_suggestion'"
    );
    $exists = (int) $stmt->fetchColumn() > 0;

    if (!$exists) {
        $pdo->exec("ALTER TABLE menu_products ADD COLUMN chef_suggestion TEXT DEFAULT NULL AFTER image_title");
        echo "Database schema updated successfully: Added 'chef_suggestion' column.\n";
    } else {
        echo "Column 'chef_suggestion' already exists.\n";
    }
} catch (PDOException $e) {
    echo "Error updating schema: " . $e->getMessage() . "\n";
}
