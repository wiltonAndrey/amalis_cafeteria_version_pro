<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

try {
    // Add image_alt and image_title columns to hero table if they don't exist
    // Using a more robust check for MySQL
    $pdo->exec("ALTER TABLE hero ADD COLUMN IF NOT EXISTS image_alt VARCHAR(255) DEFAULT '' AFTER background_image");
    $pdo->exec("ALTER TABLE hero ADD COLUMN IF NOT EXISTS image_title VARCHAR(255) DEFAULT '' AFTER image_alt");
    
    echo "Hero table schema updated successfully: Added 'image_alt' and 'image_title' columns.\n";
} catch (PDOException $e) {
    // Fallback if IF NOT EXISTS is not supported (older MySQL versions)
    try {
        $pdo->exec("ALTER TABLE hero ADD COLUMN image_alt VARCHAR(255) DEFAULT '' AFTER background_image");
        $pdo->exec("ALTER TABLE hero ADD COLUMN image_title VARCHAR(255) DEFAULT '' AFTER image_alt");
        echo "Hero table schema updated successfully.\n";
    } catch (PDOException $e2) {
        echo "Note: Columns might already exist or error occurred: " . $e2->getMessage() . "\n";
    }
}
