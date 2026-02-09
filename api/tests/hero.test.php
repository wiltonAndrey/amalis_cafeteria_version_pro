<?php
ob_start();
require __DIR__ . '/../hero.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data) || !array_key_exists('title', $data) || !array_key_exists('backgroundImage', $data)) {
  fwrite(STDERR, "FAIL: hero payload invalid\n");
  exit(1);
}

echo "PASS\n";
