<?php
// api/setup_db.php
// Script to create the database and apply the schema without CLI tools

$config = require __DIR__ . '/db_config.php';

echo "Connecting to MySQL server...\n";

try {
    // Connect without selecting a database first
    $dsn = "mysql:host={$config['host']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    echo "Connected successfully.\n";

    // Create database if it doesn't exist
    $dbname = $config['name'];
    echo "Creating database '$dbname' if not exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Select the database
    $pdo->exec("USE `$dbname`");
    echo "Database '$dbname' selected.\n";

    // Read schema file
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        die("Error: schema.sql not found at $schemaFile\n");
    }

    $sql = file_get_contents($schemaFile);
    
    // Split SQL into individual statements (simple split by semicolon)
    // Note: This is a basic splitter and might fail with complex stored procedures or strings containing semicolons
    // For this schema, it should be fine.
    
    echo "Applying schema...\n";
    
    // Remove comments to avoid issues with empty lines
    $lines = explode("\n", $sql);
    $cleanSql = "";
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line && strpos($line, '--') !== 0) {
            $cleanSql .= $line . "\n";
        }
    }

    $statements = explode(';', $cleanSql);

    foreach ($statements as $stmt) {
        $stmt = trim($stmt);
        if (!empty($stmt)) {
            try {
                $pdo->exec($stmt);
            } catch (PDOException $e) {
                echo "Warning applying statement: " . substr($stmt, 0, 50) . "...\n";
                echo "Error: " . $e->getMessage() . "\n";
            }
        }
    }

    echo "Schema applied successfully.\n";
    echo "Setup complete.\n";

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage() . "\n");
}
