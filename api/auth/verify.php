<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/_auth.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$result = require_auth();
if (!$result['ok']) {
  return;
}

Response::json($result);
