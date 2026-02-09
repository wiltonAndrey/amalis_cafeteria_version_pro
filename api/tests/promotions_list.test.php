<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../promotions/list.php';

$cards = promotions_list_cards(get_pdo());

if (!is_array($cards) || count($cards) < 3) {
  fwrite(STDERR, "FAIL: expected at least 3 promotion cards\n");
  exit(1);
}

$first = $cards[0];
$requiredKeys = [
  'id',
  'badge',
  'title',
  'price',
  'description',
  'image',
  'image_alt',
  'image_title',
  'items',
  'availability_text',
  'cta_label',
  'cta_url',
];

foreach ($requiredKeys as $key) {
  if (!array_key_exists($key, $first)) {
    fwrite(STDERR, "FAIL: missing key {$key}\n");
    exit(1);
  }
}

if (!is_array($first['items'])) {
  fwrite(STDERR, "FAIL: items must be parsed as array\n");
  exit(1);
}

echo "PASS\n";
