<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

try {
    $stmt = $pdo->query(
        "SELECT COUNT(*) AS total
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_products'
           AND COLUMN_NAME = 'alt_text'"
    );
    $exists = (int) $stmt->fetchColumn() > 0;

    if (!$exists) {
        $pdo->exec("ALTER TABLE menu_products ADD COLUMN alt_text VARCHAR(255) DEFAULT '' AFTER image");
        echo "Database schema updated successfully: Added 'alt_text' column.\n";
    } else {
        echo "Column 'alt_text' already exists.\n";
    }
} catch (PDOException $e) {
    echo "Error updating schema: " . $e->getMessage() . "\n";
}
