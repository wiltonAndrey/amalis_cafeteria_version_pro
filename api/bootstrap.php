<?php
$config = require __DIR__ . '/db_config.php';

if (!function_exists('get_pdo')) {
  function get_pdo(): PDO
  {
    static $pdo = null;
    if ($pdo) {
      return $pdo;
    }

    $config = $GLOBALS['config'] ?? require __DIR__ . '/db_config.php';

    $dsn = sprintf(
      'mysql:host=%s;dbname=%s;charset=utf8mb4',
      $config['host'],
      $config['name']
    );

    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
  }
}

if (php_sapi_name() !== 'cli') {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Validator.php';
require_once __DIR__ . '/middleware/Auth.php';
