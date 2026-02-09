<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../promotions/list.php';
require __DIR__ . '/../promotions/update.php';

$pdo = get_pdo();
$promotionId = (int) $pdo->query('SELECT id FROM promotion_cards ORDER BY sort_order, id LIMIT 1')->fetchColumn();
if ($promotionId <= 0) {
  fwrite(STDERR, "FAIL: missing seed promotion card\n");
  exit(1);
}

$unauthorized = promotions_update_handle($pdo, ['id' => $promotionId], false);
if (($unauthorized['status'] ?? 0) !== 401 || ($unauthorized['error'] ?? '') !== 'unauthorized') {
  fwrite(STDERR, "FAIL: unauthorized update must return 401 unauthorized\n");
  exit(1);
}

$missingId = promotions_update_handle($pdo, ['title' => 'X'], true);
if (($missingId['status'] ?? 0) !== 400 || ($missingId['error'] ?? '') !== 'missing_id') {
  fwrite(STDERR, "FAIL: missing id must return 400 missing_id\n");
  exit(1);
}

$invalidPrice = promotions_update_handle($pdo, ['id' => $promotionId, 'price' => 'abc'], true);
if (($invalidPrice['status'] ?? 0) !== 400 || ($invalidPrice['error'] ?? '') !== 'invalid_price') {
  fwrite(STDERR, "FAIL: invalid price must return 400 invalid_price\n");
  exit(1);
}

$invalidUrl = promotions_update_handle($pdo, ['id' => $promotionId, 'cta_url' => 'javascript:alert(1)'], true);
if (($invalidUrl['status'] ?? 0) !== 400 || ($invalidUrl['error'] ?? '') !== 'invalid_cta_url') {
  fwrite(STDERR, "FAIL: invalid cta_url must return 400 invalid_cta_url\n");
  exit(1);
}

$updated = promotions_update_handle($pdo, [
  'id' => $promotionId,
  'badge' => 'Actualizado',
  'title' => 'Promo Actualizada',
  'price' => 6.75,
  'description' => 'Descripcion actualizada',
  'image' => '/images/new.webp',
  'image_alt' => 'Alt actualizado',
  'image_title' => 'Title actualizado',
  'items' => ['Uno', 'Dos'],
  'availability_text' => 'Siempre',
  'cta_label' => 'Ver promo',
  'cta_url' => '/promociones/actualizada',
], true);

if (($updated['status'] ?? 0) !== 200 || empty($updated['promotionCard'])) {
  fwrite(STDERR, "FAIL: expected successful update payload\n");
  exit(1);
}

$cards = promotions_list_cards($pdo);
$first = null;
foreach ($cards as $card) {
  if ((int) $card['id'] === $promotionId) {
    $first = $card;
    break;
  }
}

if (!$first || $first['title'] !== 'Promo Actualizada') {
  fwrite(STDERR, "FAIL: updated title not persisted\n");
  exit(1);
}

if ($first['price'] !== 6.75) {
  fwrite(STDERR, "FAIL: updated price not persisted\n");
  exit(1);
}

if ($first['cta_url'] !== '/promociones/actualizada') {
  fwrite(STDERR, "FAIL: updated cta_url not persisted\n");
  exit(1);
}

if ($first['items'] !== ['Uno', 'Dos']) {
  fwrite(STDERR, "FAIL: updated items not persisted\n");
  exit(1);
}

echo "PASS\n";
