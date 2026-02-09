<?php

$defaults = [
  'host' => 'localhost',
  'name' => 'amalis_cms',
  'user' => 'root',
  'pass' => '',
];

$localConfigPath = __DIR__ . '/db_config.local.php';
$localConfig = [];
if (is_file($localConfigPath)) {
  $loaded = require $localConfigPath;
  if (is_array($loaded)) {
    $localConfig = $loaded;
  }
}

$resolve = static function (string $envKey, string $localKey, string $defaultKey) use ($localConfig, $defaults): string {
  $envValue = getenv($envKey);
  if ($envValue !== false && $envValue !== '') {
    return (string) $envValue;
  }

  $localValue = $localConfig[$localKey] ?? '';
  if (is_string($localValue) && $localValue !== '') {
    return $localValue;
  }

  return (string) ($defaults[$defaultKey] ?? '');
};

return [
  'host' => $resolve('DB_HOST', 'host', 'host'),
  'name' => $resolve('DB_NAME', 'name', 'name'),
  'user' => $resolve('DB_USER', 'user', 'user'),
  'pass' => $resolve('DB_PASS', 'pass', 'pass'),
];
