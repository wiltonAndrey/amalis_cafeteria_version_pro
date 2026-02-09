<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/list.php';

function promotions_is_valid_cta_url(string $url): bool
{
  if ($url === '') {
    return false;
  }

  if (str_starts_with($url, '/')) {
    return true;
  }

  return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

function promotions_normalize_items(mixed $items): ?array
{
  if (!is_array($items)) {
    return null;
  }

  $normalized = [];
  foreach ($items as $item) {
    $value = trim((string) $item);
    if ($value !== '') {
      $normalized[] = $value;
    }
  }

  if (count($normalized) === 0) {
    return null;
  }

  return $normalized;
}

function promotions_fetch_card_by_id(PDO $pdo, int $id): ?array
{
  $stmt = $pdo->prepare(
    'SELECT id, badge, title, price, description, image, image_alt, image_title, items, availability_text, cta_label, cta_url
     FROM promotion_cards
     WHERE id = ?
     LIMIT 1'
  );
  $stmt->execute([$id]);
  $row = $stmt->fetch();

  if (!$row) {
    return null;
  }

  $items = json_decode((string) $row['items'], true);
  return [
    'id' => (string) $row['id'],
    'badge' => (string) $row['badge'],
    'title' => (string) $row['title'],
    'price' => (float) $row['price'],
    'description' => (string) $row['description'],
    'image' => (string) $row['image'],
    'image_alt' => (string) $row['image_alt'],
    'image_title' => (string) $row['image_title'],
    'items' => is_array($items) ? array_values($items) : [],
    'availability_text' => (string) $row['availability_text'],
    'cta_label' => (string) $row['cta_label'],
    'cta_url' => (string) $row['cta_url'],
  ];
}

function promotions_update_handle(PDO $pdo, array $payload, bool $authorized): array
{
  if (!$authorized) {
    return ['status' => 401, 'error' => 'unauthorized'];
  }

  $id = filter_var($payload['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
  if ($id === false) {
    return ['status' => 400, 'error' => 'missing_id'];
  }

  $updatableTextFields = [
    'badge',
    'title',
    'description',
    'image',
    'image_alt',
    'image_title',
    'availability_text',
    'cta_label',
  ];

  $updateColumns = [];
  $updateValues = [];

  foreach ($updatableTextFields as $field) {
    if (array_key_exists($field, $payload)) {
      $value = trim((string) $payload[$field]);
      if ($value === '') {
        return ['status' => 400, 'error' => "invalid_{$field}"];
      }
      $updateColumns[] = "{$field} = ?";
      $updateValues[] = $value;
    }
  }

  if (array_key_exists('price', $payload)) {
    if (!is_numeric($payload['price'])) {
      return ['status' => 400, 'error' => 'invalid_price'];
    }
    $price = round((float) $payload['price'], 2);
    if ($price <= 0) {
      return ['status' => 400, 'error' => 'invalid_price'];
    }
    $updateColumns[] = 'price = ?';
    $updateValues[] = $price;
  }

  if (array_key_exists('cta_url', $payload)) {
    $ctaUrl = trim((string) $payload['cta_url']);
    if (!promotions_is_valid_cta_url($ctaUrl)) {
      return ['status' => 400, 'error' => 'invalid_cta_url'];
    }
    $updateColumns[] = 'cta_url = ?';
    $updateValues[] = $ctaUrl;
  }

  if (array_key_exists('items', $payload)) {
    $items = promotions_normalize_items($payload['items']);
    if ($items === null) {
      return ['status' => 400, 'error' => 'invalid_items'];
    }
    $updateColumns[] = 'items = ?';
    $updateValues[] = json_encode($items, JSON_UNESCAPED_UNICODE);
  }

  if (count($updateColumns) === 0) {
    return ['status' => 400, 'error' => 'missing_fields'];
  }

  $exists = promotions_fetch_card_by_id($pdo, (int) $id);
  if ($exists === null) {
    return ['status' => 404, 'error' => 'not_found'];
  }

  $sql = sprintf('UPDATE promotion_cards SET %s WHERE id = ?', implode(', ', $updateColumns));
  $stmt = $pdo->prepare($sql);
  $stmt->execute([...$updateValues, (int) $id]);

  $updated = promotions_fetch_card_by_id($pdo, (int) $id);
  if ($updated === null) {
    return ['status' => 404, 'error' => 'not_found'];
  }

  return ['status' => 200, 'promotionCard' => $updated];
}

if (basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
  if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
  }

  $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
  if (!in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    Response::json(['ok' => false, 'error' => 'method_not_allowed'], 405);
    return;
  }

  $body = json_decode(file_get_contents('php://input'), true);
  if (!is_array($body)) {
    $body = [];
  }

  $auth = require_auth();
  $result = promotions_update_handle(get_pdo(), $body, (bool) ($auth['ok'] ?? false));
  if (($result['status'] ?? 500) !== 200) {
    Response::json(['ok' => false, 'error' => $result['error'] ?? 'unknown_error'], (int) $result['status']);
    return;
  }

  Response::json([
    'ok' => true,
    'promotionCard' => $result['promotionCard'],
  ]);
}
