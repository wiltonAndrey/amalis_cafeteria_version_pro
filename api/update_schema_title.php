<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

try {
    $stmt = $pdo->query(
        "SELECT COUNT(*) AS total
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_products'
           AND COLUMN_NAME = 'image_title'"
    );
    $exists = (int) $stmt->fetchColumn() > 0;

    if (!$exists) {
        $pdo->exec("ALTER TABLE menu_products ADD COLUMN image_title VARCHAR(255) DEFAULT '' AFTER alt_text");
        echo "Database schema updated successfully: Added 'image_title' column.\n";
    } else {
        echo "Column 'image_title' already exists.\n";
    }
} catch (PDOException $e) {
    echo "Error updating schema: " . $e->getMessage() . "\n";
}
