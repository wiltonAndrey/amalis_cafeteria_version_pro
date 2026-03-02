<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();

$updates = [
  114 => '/images/products/cafe_solo.webp',
  115 => '/images/products/cafe_cortado.webp',
  116 => '/images/products/cafe_con_leche.webp',
  117 => '/images/products/cafe_bombon.webp',
  118 => '/images/products/cafe_americano.webp',
  120 => '/images/products/cafe_carajillo.webp',
  121 => '/images/products/cafe_belmonte.webp',
  122 => '/images/products/capuchino.webp',
];

try {
  $pdo->beginTransaction();

  $updateStmt = $pdo->prepare(
    'UPDATE menu_products SET image = ? WHERE id = ? AND active = 1'
  );

  foreach ($updates as $id => $image) {
    $updateStmt->execute([$image, $id]);
  }

  $pdo->commit();

  $rows = $pdo->query(
    'SELECT id, name, image FROM menu_products WHERE active = 1 ORDER BY sort_order, id'
  )->fetchAll();

  $missing = [];
  foreach ($rows as $row) {
    $image = (string) ($row['image'] ?? '');
    $diskPath = dirname(__DIR__, 2) . '/public' . $image;
    if ($image === '' || !is_file($diskPath)) {
      $missing[] = $row;
    }
  }

  echo json_encode([
    'ok' => true,
    'updated_rows' => count($updates),
    'missing_active_images' => count($missing),
    'remaining_missing' => $missing,
  ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }

  fwrite(STDERR, "FAIL: {$error->getMessage()}\n");
  exit(1);
}
