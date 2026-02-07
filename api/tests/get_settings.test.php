<?php
ob_start();
require __DIR__ . '/../get_settings.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data) || empty($data['seo']) || empty($data['hero'])) {
  fwrite(STDERR, "FAIL: missing settings keys\n");
  exit(1);
}

echo "PASS\n";
