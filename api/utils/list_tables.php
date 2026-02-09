<?php
$config = require __DIR__ . '/../db_config.php';
$pdo = new PDO("mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4", $config['user'], $config['pass']);
echo json_encode($pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN));
