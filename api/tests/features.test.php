<?php
ob_start();
require __DIR__ . '/../features.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data)) {
  fwrite(STDERR, "FAIL: features payload invalid\n");
  exit(1);
}

if (!empty($data)) {
  $first = $data[0];
  $required = ['id', 'title', 'description', 'icon', 'sortOrder'];
  foreach ($required as $key) {
    if (!array_key_exists($key, $first)) {
      fwrite(STDERR, "FAIL: missing {$key} in features payload\n");
      exit(1);
    }
  }
}

echo "PASS\n";
