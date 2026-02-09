<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'POST') {
  $auth = require_auth();
  if (empty($auth['ok'])) {
    return;
  }

  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  $input = array_merge($_POST, is_array($body) ? $body : []);

  $siteName = Validator::string_trim($input['siteName'] ?? '');
  $logoUrl = Validator::string_trim($input['logoUrl'] ?? '');
  $footerText = Validator::string_trim($input['footerText'] ?? '');
  $openingHours = Validator::string_trim($input['openingHours'] ?? '');
  $address = Validator::string_trim($input['address'] ?? '');
  $phone = Validator::string_trim($input['phone'] ?? '');
  $email = Validator::string_trim($input['email'] ?? '');

  $socialLinks = $input['socialLinks'] ?? [];
  if (!is_array($socialLinks)) {
    $socialLinks = [];
  }

  $instagram = Validator::string_trim($socialLinks['instagram'] ?? '');
  $facebook = Validator::string_trim($socialLinks['facebook'] ?? '');
  $twitter = Validator::string_trim($socialLinks['twitter'] ?? '');

  try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare(
      'INSERT INTO settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );

    $updates = [
      'site_name' => $siteName,
      'logo_url' => $logoUrl,
      'footer_text' => $footerText,
      'opening_hours' => $openingHours,
      'contact_address' => $address,
      'contact_phone' => $phone,
      'contact_email' => $email,
      'social_instagram' => $instagram,
      'social_facebook' => $facebook,
      'social_twitter' => $twitter,
    ];

    foreach ($updates as $key => $value) {
      $stmt->execute([$key, $value]);
    }

    $pdo->commit();
    Response::json(['ok' => true]);
  } catch (Throwable $error) {
    if ($pdo->inTransaction()) {
      $pdo->rollBack();
    }
    Response::json(['ok' => false, 'error' => 'db_error'], 500);
  }

  return;
}

try {
  $rows = $pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll();
  $map = [];
  foreach ($rows as $row) {
    $map[$row['setting_key']] = $row['setting_value'];
  }

  echo json_encode([
    'siteName' => $map['site_name'] ?? '',
    'logoUrl' => $map['logo_url'] ?? '',
    'footerText' => $map['footer_text'] ?? '',
    'address' => $map['contact_address'] ?? '',
    'phone' => $map['contact_phone'] ?? '',
    'email' => $map['contact_email'] ?? '',
    'openingHours' => $map['opening_hours'] ?? ($map['contact_hours'] ?? ''),
    'socialLinks' => [
      'instagram' => $map['social_instagram'] ?? '',
      'facebook' => $map['social_facebook'] ?? '',
      'twitter' => $map['social_twitter'] ?? '',
    ],
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
