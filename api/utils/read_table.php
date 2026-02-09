<?php
/**
 * Herramienta para leer el contenido de una tabla específica.
 */

$config = require __DIR__ . '/../db_config.php';
$table = $argv[1] ?? 'menu_products';

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $data = $pdo->query("SELECT * FROM `$table` LIMIT 100")->fetchAll();

    header('Content-Type: application/json');
    echo json_encode($data, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
