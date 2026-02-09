<?php

require_once __DIR__ . '/../utils/Response.php';

function require_auth(): array
{
  if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
  }

  if (empty($_SESSION['admin_id'])) {
    Response::json(['ok' => false, 'error' => 'unauthorized'], 401);
    return ['ok' => false];
  }

  return [
    'ok' => true,
    'admin' => [
      'id' => $_SESSION['admin_id'],
      'email' => $_SESSION['admin_email'] ?? '',
    ],
  ];
}
