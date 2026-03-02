<?php
ob_start();
require __DIR__ . '/../health.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data)) {
  fwrite(STDERR, "FAIL: invalid JSON\n");
  exit(1);
}

if (empty($data['ok']) || ($data['status'] ?? '') !== 'healthy') {
  fwrite(STDERR, "FAIL: health endpoint not healthy\n");
  exit(1);
}

echo "PASS\n";
