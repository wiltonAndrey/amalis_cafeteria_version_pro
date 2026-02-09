<?php
ob_start();
require __DIR__ . '/../testimonials.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data)) {
  fwrite(STDERR, "FAIL: testimonials payload invalid\n");
  exit(1);
}

if (!empty($data)) {
  $first = $data[0];
  $required = ['id', 'name', 'role', 'content', 'avatarUrl'];
  foreach ($required as $key) {
    if (!array_key_exists($key, $first)) {
      fwrite(STDERR, "FAIL: missing {$key} in testimonials payload\n");
      exit(1);
    }
  }
}

echo "PASS\n";
