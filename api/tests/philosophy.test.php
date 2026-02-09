<?php
ob_start();
require __DIR__ . '/../philosophy.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data) || !array_key_exists('title', $data) || !array_key_exists('content', $data)) {
  fwrite(STDERR, "FAIL: philosophy payload invalid\n");
  exit(1);
}

echo "PASS\n";
