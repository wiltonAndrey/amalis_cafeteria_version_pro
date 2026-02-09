<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

function hero_has_column(PDO $pdo, string $column): bool
{
  static $columns = null;
  if ($columns === null) {
    $rows = $pdo->query('SHOW COLUMNS FROM hero')->fetchAll();
    $columns = [];
    foreach ($rows as $row) {
      $columns[] = (string) ($row['Field'] ?? '');
    }
  }

  return in_array($column, $columns, true);
}

function hero_load_settings_map(PDO $pdo): array
{
  $rows = $pdo->query(
    "SELECT setting_key, setting_value
     FROM settings
     WHERE setting_key IN ('hero_title', 'hero_subtitle', 'hero_quote')"
  )->fetchAll();

  $map = [];
  foreach ($rows as $row) {
    $map[(string) $row['setting_key']] = (string) $row['setting_value'];
  }

  return $map;
}

function hero_upsert_setting(PDO $pdo, string $key, string $value): void
{
  $stmt = $pdo->prepare(
    'INSERT INTO settings (setting_key, setting_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
  );
  $stmt->execute([$key, $value]);
}

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'POST') {
  $auth = require_auth();
  if (empty($auth['ok'])) {
    return;
  }

  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  $input = array_merge($_POST, is_array($body) ? $body : []);

  $title = Validator::string_trim($input['title'] ?? '');
  $subtitle = Validator::string_trim($input['subtitle'] ?? '');
  $quote = Validator::string_trim($input['quote'] ?? '');
  $backgroundImage = Validator::string_trim($input['backgroundImage'] ?? '');
  $imageAlt = Validator::string_trim($input['imageAlt'] ?? '');
  $imageTitle = Validator::string_trim($input['imageTitle'] ?? '');

  if (!Validator::required($title) || !Validator::required($subtitle) || !Validator::required($backgroundImage)) {
    Response::json(['ok' => false, 'error' => 'missing_fields'], 400);
    return;
  }

  try {
    $hasTitle = hero_has_column($pdo, 'title');
    $hasSubtitle = hero_has_column($pdo, 'subtitle');
    $hasQuote = hero_has_column($pdo, 'quote');
    $hasBackgroundImage = hero_has_column($pdo, 'background_image');
    $hasImageAlt = hero_has_column($pdo, 'image_alt');
    $hasImageTitle = hero_has_column($pdo, 'image_title');

    $columns = [];
    $values = [];

    if ($hasTitle) {
      $columns[] = 'title';
      $values[] = $title;
    } else {
      hero_upsert_setting($pdo, 'hero_title', $title);
    }

    if ($hasSubtitle) {
      $columns[] = 'subtitle';
      $values[] = $subtitle;
    } else {
      hero_upsert_setting($pdo, 'hero_subtitle', $subtitle);
    }

    if ($hasQuote) {
      $columns[] = 'quote';
      $values[] = $quote;
    } else {
      hero_upsert_setting($pdo, 'hero_quote', $quote);
    }

    if ($hasBackgroundImage) {
      $columns[] = 'background_image';
      $values[] = $backgroundImage;
    }

    if ($hasImageAlt) {
      $columns[] = 'image_alt';
      $values[] = $imageAlt;
    }

    if ($hasImageTitle) {
      $columns[] = 'image_title';
      $values[] = $imageTitle;
    }

    if (count($columns) > 0) {
      $row = $pdo->query('SELECT id FROM hero ORDER BY id LIMIT 1')->fetch();
      if ($row) {
        $sets = [];
        foreach ($columns as $column) {
          $sets[] = $column . ' = ?';
        }
        $stmt = $pdo->prepare('UPDATE hero SET ' . implode(', ', $sets) . ' WHERE id = ?');
        $stmt->execute([...$values, $row['id']]);
      } else {
        $placeholders = implode(', ', array_fill(0, count($columns), '?'));
        $stmt = $pdo->prepare(
          'INSERT INTO hero (' . implode(', ', $columns) . ') VALUES (' . $placeholders . ')'
        );
        $stmt->execute($values);
      }
    }

    Response::json(['ok' => true]);
  } catch (Throwable $error) {
    Response::json(['ok' => false, 'error' => 'db_error'], 500);
  }

  return;
}

try {
  $hasTitle = hero_has_column($pdo, 'title');
  $hasSubtitle = hero_has_column($pdo, 'subtitle');
  $hasQuote = hero_has_column($pdo, 'quote');
  $hasBackgroundImage = hero_has_column($pdo, 'background_image');
  $hasImageAlt = hero_has_column($pdo, 'image_alt');
  $hasImageTitle = hero_has_column($pdo, 'image_title');

  $selectColumns = [];
  if ($hasTitle) {
    $selectColumns[] = 'title';
  }
  if ($hasSubtitle) {
    $selectColumns[] = 'subtitle';
  }
  if ($hasQuote) {
    $selectColumns[] = 'quote';
  }
  if ($hasBackgroundImage) {
    $selectColumns[] = 'background_image';
  }
  if ($hasImageAlt) {
    $selectColumns[] = 'image_alt';
  }
  if ($hasImageTitle) {
    $selectColumns[] = 'image_title';
  }

  $row = null;
  if (count($selectColumns) > 0) {
    $sql = 'SELECT ' . implode(', ', $selectColumns) . ' FROM hero ORDER BY id LIMIT 1';
    $row = $pdo->query($sql)->fetch() ?: null;
  }

  $settings = (!$hasTitle || !$hasSubtitle || !$hasQuote) ? hero_load_settings_map($pdo) : [];

  echo json_encode([
    'title' => $hasTitle ? (string) ($row['title'] ?? '') : (string) ($settings['hero_title'] ?? ''),
    'subtitle' => $hasSubtitle ? (string) ($row['subtitle'] ?? '') : (string) ($settings['hero_subtitle'] ?? ''),
    'quote' => $hasQuote ? (string) ($row['quote'] ?? '') : (string) ($settings['hero_quote'] ?? ''),
    'backgroundImage' => $hasBackgroundImage ? (string) ($row['background_image'] ?? '') : '',
    'imageAlt' => $hasImageAlt ? (string) ($row['image_alt'] ?? '') : '',
    'imageTitle' => $hasImageTitle ? (string) ($row['image_title'] ?? '') : '',
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  Response::json(['ok' => false, 'error' => 'db_error'], 500);
}
