<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

try {
    $categorySchemaChanges = menu_categories_ensure_schema($pdo);

    $columnExistsStmt = $pdo->query(
        "SELECT COUNT(*) FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'menu_products'
           AND COLUMN_NAME = 'subcategory'"
    );
    $hasSubcategory = (int) $columnExistsStmt->fetchColumn() > 0;

    if (!$hasSubcategory) {
        $pdo->exec("ALTER TABLE menu_products ADD COLUMN subcategory VARCHAR(32) DEFAULT NULL AFTER category");
    }

    $pdo->beginTransaction();

    $pdo->exec(
        "INSERT INTO menu_categories (id, label, sort_order)
         VALUES ('bebidas', 'Bebidas', 6)
         ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order)"
    );

    $selectLegacy = $pdo->query(
        "SELECT id, name, category, subcategory
         FROM menu_products
         WHERE LOWER(category) IN ('cafes', 'cafe')"
    );
    $legacyRows = $selectLegacy->fetchAll(PDO::FETCH_ASSOC);

    $updateLegacy = $pdo->prepare(
        "UPDATE menu_products
         SET category = 'bebidas', subcategory = ?
         WHERE id = ?"
    );

    $migratedLegacy = 0;
    foreach ($legacyRows as $row) {
        $subcategory = menu_taxonomy_derive_beverage_subcategory((string) ($row['name'] ?? ''));
        $updateLegacy->execute([$subcategory, (int) $row['id']]);
        $migratedLegacy += $updateLegacy->rowCount();
    }

    $selectMissingSubcategory = $pdo->query(
        "SELECT id, name
         FROM menu_products
         WHERE category = 'bebidas'
           AND (subcategory IS NULL OR TRIM(subcategory) = '')"
    );
    $rowsMissingSubcategory = $selectMissingSubcategory->fetchAll(PDO::FETCH_ASSOC);

    $fillSubcategory = $pdo->prepare(
        "UPDATE menu_products SET subcategory = ? WHERE id = ?"
    );

    $filledSubcategories = 0;
    foreach ($rowsMissingSubcategory as $row) {
        $subcategory = menu_taxonomy_derive_beverage_subcategory((string) ($row['name'] ?? ''));
        $fillSubcategory->execute([$subcategory, (int) $row['id']]);
        $filledSubcategories += $fillSubcategory->rowCount();
    }

    $deleteLegacyCategory = $pdo->prepare("DELETE FROM menu_categories WHERE id IN ('cafes', 'cafe')");
    $deleteLegacyCategory->execute();

    $pdo->commit();

    echo json_encode([
        'ok' => true,
        'category_schema' => $categorySchemaChanges,
        'subcategory_column_added' => !$hasSubcategory,
        'legacy_cafes_products_migrated' => $migratedLegacy,
        'bebidas_subcategories_filled' => $filledSubcategories,
        'legacy_category_rows_deleted' => $deleteLegacyCategory->rowCount(),
    ], JSON_UNESCAPED_UNICODE) . PHP_EOL;
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'ok' => false,
        'error' => $error->getMessage(),
    ], JSON_UNESCAPED_UNICODE) . PHP_EOL;
    exit(1);
}
