<?php
/**
 * Herramienta de Visión Global de Base de Datos
 * Proporciona un resumen de tablas, columnas y conteo de registros para el Agente de IA.
 */

$config = require __DIR__ . '/../db_config.php';

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $vision = [
        'database' => $config['name'],
        'tables' => []
    ];

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $table) {
        // Obtener estructura de columnas
        $columns = $pdo->query("DESCRIBE `$table`")->fetchAll();
        
        // Obtener conteo de registros
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();

        $vision['tables'][$table] = [
            'count' => $count,
            'columns' => array_map(function($col) {
                return [
                    'field' => $col['Field'],
                    'type' => $col['Type'],
                    'null' => $col['Null'],
                    'key' => $col['Key'],
                    'default' => $col['Default'],
                    'extra' => $col['Extra']
                ];
            }, $columns)
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($vision, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
