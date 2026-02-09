<?php
require __DIR__ . '/bootstrap.php';
$auth = require_auth();
if (empty($auth['ok'])) {
  return;
}

if (empty($_FILES['image'])) {
  Response::json(['ok' => false, 'error' => 'missing_file'], 400);
  return;
}

$file = $_FILES['image'];
if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
  Response::json(['ok' => false, 'error' => 'upload_error'], 400);
  return;
}

$maxBytes = 5 * 1024 * 1024;
if (!empty($file['size']) && (int) $file['size'] > $maxBytes) {
  Response::json(['ok' => false, 'error' => 'file_too_large'], 413);
  return;
}

$allowed = [
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
];

$mime = '';
if (!empty($file['tmp_name']) && file_exists($file['tmp_name'])) {
  if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo) {
      $mime = (string) finfo_file($finfo, $file['tmp_name']);
      finfo_close($finfo);
    }
  } elseif (function_exists('mime_content_type')) {
    $mime = (string) mime_content_type($file['tmp_name']);
  }
}

if ($mime === '' && !empty($file['type'])) {
  $mime = (string) $file['type'];
}

if ($mime === '' || empty($allowed[$mime])) {
  Response::json(['ok' => false, 'error' => 'invalid_type'], 415);
  return;
}

$uploadDir = realpath(__DIR__ . '/../public/images');
if ($uploadDir === false) {
  Response::json(['ok' => false, 'error' => 'upload_dir_missing'], 500);
  return;
}

if (!is_writable($uploadDir)) {
  Response::json(['ok' => false, 'error' => 'upload_dir_not_writable'], 500);
  return;
}

$uploadDir .= DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
  Response::json(['ok' => false, 'error' => 'upload_dir_failed'], 500);
  return;
}

if (!is_writable($uploadDir)) {
  Response::json(['ok' => false, 'error' => 'upload_dir_not_writable'], 500);
  return;
}

$extension = $allowed[$mime];
$filename = bin2hex(random_bytes(10)) . '.' . $extension;
$targetPath = $uploadDir . DIRECTORY_SEPARATOR . $filename;

$moved = false;
if (!empty($file['tmp_name'])) {
  if (is_uploaded_file($file['tmp_name'])) {
    $moved = move_uploaded_file($file['tmp_name'], $targetPath);
  } elseif (php_sapi_name() === 'cli') {
    $moved = rename($file['tmp_name'], $targetPath);
  }
}

if (!$moved) {
  Response::json(['ok' => false, 'error' => 'move_failed'], 500);
  return;
}

Response::json(['ok' => true, 'url' => '/images/uploads/' . $filename], 201);
