<?php
require_once __DIR__ . '/../bootstrap.php';

function promotions_list_cards(PDO $pdo): array
{
  $rows = $pdo->query(
    'SELECT id, badge, title, price, description, image, image_alt, image_title, items, availability_text, cta_label, cta_url
     FROM promotion_cards
     WHERE active = 1
     ORDER BY sort_order, id'
  )->fetchAll();

  return array_map(static function (array $row): array {
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
  }, $rows);
}

if (basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
  echo json_encode([
    'promotionCards' => promotions_list_cards(get_pdo()),
  ], JSON_UNESCAPED_UNICODE);
}
