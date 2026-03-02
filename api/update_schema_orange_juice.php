<?php
require __DIR__ . '/bootstrap.php';

// Ensure bebidas taxonomy/subcategory support exists before inserting the row.
ob_start();
require __DIR__ . '/update_schema_menu_taxonomy.php';
ob_end_clean();

$pdo = get_pdo();

$payload = [
    'name' => 'Zumo de Naranja',
    'price' => 2.50,
    'category' => 'bebidas',
    'subcategory' => 'zumos',
    'description' => 'Zumo de naranja natural recién exprimido, fresco y con sabor cítrico intenso. Ideal para desayunos y pausas refrescantes.',
    'image' => '/images/products/zumo_de_naranja.webp',
    'ingredients' => json_encode(['Naranjas naturales recién exprimidas'], JSON_UNESCAPED_UNICODE),
    'allergens' => json_encode(['Ninguno'], JSON_UNESCAPED_UNICODE),
    'featured' => 0,
    'active' => 1,
    'sort_order' => 48,
];

try {
    $pdo->beginTransaction();

    $pdo->exec(
        "INSERT INTO menu_categories (id, label, sort_order)
         VALUES ('bebidas', 'Bebidas', 6)
         ON DUPLICATE KEY UPDATE label = VALUES(label), sort_order = VALUES(sort_order)"
    );

    $findStmt = $pdo->prepare(
        "SELECT id
         FROM menu_products
         WHERE name = :name
         ORDER BY (category = 'bebidas') DESC, active DESC, id ASC"
    );
    $findStmt->execute(['name' => $payload['name']]);
    $rows = $findStmt->fetchAll(PDO::FETCH_COLUMN);
    $rows = array_values(array_map('intval', $rows ?: []));

    if ($rows !== []) {
        $updateStmt = $pdo->prepare(
            'UPDATE menu_products SET
                price = :price,
                category = :category,
                subcategory = :subcategory,
                description = :description,
                image = :image,
                ingredients = :ingredients,
                allergens = :allergens,
                featured = :featured,
                active = :active,
                sort_order = :sort_order
             WHERE id = :id'
        );

        $updateStmt->execute([
            'id' => $rows[0],
            'price' => $payload['price'],
            'category' => $payload['category'],
            'subcategory' => $payload['subcategory'],
            'description' => $payload['description'],
            'image' => $payload['image'],
            'ingredients' => $payload['ingredients'],
            'allergens' => $payload['allergens'],
            'featured' => $payload['featured'],
            'active' => $payload['active'],
            'sort_order' => $payload['sort_order'],
        ]);

        $duplicateIds = array_slice($rows, 1);
        $duplicatesDeactivated = 0;
        if ($duplicateIds !== []) {
            $in = implode(',', array_fill(0, count($duplicateIds), '?'));
            $deactivateStmt = $pdo->prepare("UPDATE menu_products SET active = 0 WHERE id IN ($in)");
            $deactivateStmt->execute($duplicateIds);
            $duplicatesDeactivated = $deactivateStmt->rowCount();
        }

        $pdo->commit();
        echo json_encode([
            'ok' => true,
            'action' => 'updated',
            'id' => $rows[0],
            'duplicates_deactivated' => $duplicatesDeactivated,
        ], JSON_UNESCAPED_UNICODE) . PHP_EOL;
        exit(0);
    }

    $insertStmt = $pdo->prepare(
        'INSERT INTO menu_products
            (name, price, category, subcategory, description, image, ingredients, allergens, featured, active, sort_order)
         VALUES
            (:name, :price, :category, :subcategory, :description, :image, :ingredients, :allergens, :featured, :active, :sort_order)'
    );
    $insertStmt->execute($payload);

    $newId = (int) $pdo->lastInsertId();
    $pdo->commit();

    echo json_encode([
        'ok' => true,
        'action' => 'inserted',
        'id' => $newId,
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

