<?php
ob_start();
require __DIR__ . '/../settings.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data) || !array_key_exists('siteName', $data) || !array_key_exists('socialLinks', $data)) {
  fwrite(STDERR, "FAIL: settings payload invalid\n");
  exit(1);
}

echo "PASS\n";
