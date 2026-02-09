<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

function run_upload_case(array $file): array
{
  $_SESSION['admin_id'] = 1;
  $_POST = [];
  $_FILES = ['image' => $file];

  ob_start();
  require __DIR__ . '/../upload.php';
  $json = ob_get_clean();

  $data = json_decode($json, true);
  return is_array($data) ? $data : ['ok' => false, 'error' => 'invalid_json'];
}

// Case 1: invalid mime type
$txtFile = tempnam(sys_get_temp_dir(), 'upload-text-');
file_put_contents($txtFile, 'plain text file');
$invalidType = run_upload_case([
  'name' => 'test.txt',
  'type' => 'text/plain',
  'tmp_name' => $txtFile,
  'error' => 0,
  'size' => filesize($txtFile),
]);
@unlink($txtFile);

if (($invalidType['error'] ?? null) !== 'invalid_type') {
  fwrite(STDERR, "FAIL: expected invalid_type\n");
  exit(1);
}

// Case 2: file too large
$bigFile = tempnam(sys_get_temp_dir(), 'upload-big-');
file_put_contents($bigFile, str_repeat('A', (5 * 1024 * 1024) + 10));
$tooLarge = run_upload_case([
  'name' => 'big.bin',
  'type' => 'application/octet-stream',
  'tmp_name' => $bigFile,
  'error' => 0,
  'size' => filesize($bigFile),
]);
@unlink($bigFile);

if (($tooLarge['error'] ?? null) !== 'file_too_large') {
  fwrite(STDERR, "FAIL: expected file_too_large\n");
  exit(1);
}

// Case 3: valid png upload
$pngData = base64_decode(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/l4Zz5QAAAABJRU5ErkJggg=='
);
$pngFile = tempnam(sys_get_temp_dir(), 'upload-png-');
file_put_contents($pngFile, $pngData);

$success = run_upload_case([
  'name' => 'test.png',
  'type' => 'image/png',
  'tmp_name' => $pngFile,
  'error' => 0,
  'size' => filesize($pngFile),
]);

if (empty($success['ok']) || empty($success['url'])) {
  @unlink($pngFile);
  fwrite(STDERR, "FAIL: expected successful upload\n");
  exit(1);
}

$uploadedRelative = (string) $success['url'];
$uploadedAbsolute = realpath(__DIR__ . '/../public/images') . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . basename($uploadedRelative);
if (is_string($uploadedAbsolute) && file_exists($uploadedAbsolute)) {
  @unlink($uploadedAbsolute);
}

echo "PASS\n";
