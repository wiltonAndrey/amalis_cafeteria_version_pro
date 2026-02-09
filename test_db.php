<?php
$config = require 'api/db_config.php';
try {
    $dsn = "mysql:host={$config['host']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "Connection to MySQL successful!\n";
    
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$config['name']}`");
    $pdo->exec("USE `{$config['name']}`");
    echo "Database '{$config['name']}' selected/created.\n";
    
    foreach (['menu_categories', 'menu_products', 'products', 'settings'] as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM `$table`");
        echo "Table '$table' count: " . $stmt->fetchColumn() . "\n";
    }
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
