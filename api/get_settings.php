<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();
$rows = $pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll();

$map = [];
foreach ($rows as $row) {
  $map[$row['setting_key']] = $row['setting_value'];
}

echo json_encode([
  'seo' => [
    'title' => $map['seo_title'] ?? '',
    'description' => $map['seo_description'] ?? '',
  ],
  'hero' => [
    'title' => $map['hero_title'] ?? '',
    'subtitle' => $map['hero_subtitle'] ?? '',
    'quote' => $map['hero_quote'] ?? '',
  ],
  'contact' => [
    'address' => $map['contact_address'] ?? '',
    'hours' => $map['contact_hours'] ?? '',
  ],
  'social' => [
    'instagram' => $map['social_instagram'] ?? '',
    'facebook' => $map['social_facebook'] ?? '',
    'twitter' => $map['social_twitter'] ?? '',
  ],
], JSON_UNESCAPED_UNICODE);
