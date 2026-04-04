<?php
/**
 * Utilidad de Sincronización de Productos Masiva
 * Permite al Agente de IA subir o actualizar productos desde un JSON.
 */

require __DIR__ . '/../bootstrap.php';

if (!function_exists('normalize_sync_price_unit')) {
    function normalize_sync_price_unit($value)
    {
        $normalized = trim((string) ($value ?? ''));

        if ($normalized === '') {
            return null;
        }

        if (!in_array($normalized, ['unit', 'kg'], true)) {
            return false;
        }

        return $normalized;
    }
}

try {
    $pdo = get_pdo();
    $hasPriceUnit = table_has_column($pdo, 'menu_products', 'price_unit');

    // Leer JSON de la entrada estándar (stdin)
    $input = file_get_contents('php://stdin');
    $data = json_decode($input, true);

    if (!$data || !isset($data['action'])) {
        echo json_encode(['error' => 'JSON inválido o acción no especificada']);
        exit;
    }

    $results = [];

    if ($data['action'] === 'sync_menu_products') {
        foreach ($data['products'] as $product) {
            // Verificar si existe por nombre
            $stmt = $pdo->prepare("SELECT id FROM menu_products WHERE name = ?");
            $stmt->execute([$product['name']]);
            $existing = $stmt->fetch();

            $priceUnitProvided = false;
            $priceUnit = null;

            if (array_key_exists('price_unit', $product)) {
                $priceUnit = normalize_sync_price_unit($product['price_unit']);

                if ($priceUnit !== null) {
                    $priceUnitProvided = true;
                }
            }

            if ($priceUnit === false) {
                throw new RuntimeException('price_unit inválido para ' . $product['name']);
            }

            if ($priceUnitProvided && !$hasPriceUnit) {
                throw new RuntimeException('price_unit requiere migración de schema antes de sincronizar ' . $product['name']);
            }

            $params = [
                'price' => $product['price'],
                'category' => $product['category'],
                'description' => $product['description'],
                'image' => $product['image'],
                'ingredients' => json_encode($product['ingredients'] ?? []),
                'allergens' => json_encode($product['allergens'] ?? []),
                'featured' => $product['featured'] ?? 0,
                'active' => $product['active'] ?? 1,
                'sort_order' => $product['sort_order'] ?? 0
            ];

            if ($existing) {
                // Actualizar
                $updateFields = [
                    'price = :price',
                    'category = :category',
                    'description = :description',
                    'image = :image',
                    'ingredients = :ingredients',
                    'allergens = :allergens',
                    'featured = :featured',
                    'active = :active',
                    'sort_order = :sort_order'
                ];

                if ($hasPriceUnit && $priceUnitProvided) {
                    $updateFields[] = 'price_unit = :price_unit';
                    $params['price_unit'] = $priceUnit;
                }

                $sql = 'UPDATE menu_products SET ' . implode(', ', $updateFields) . ' WHERE id = :id';
                $params['id'] = $existing['id'];
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $results[] = "Actualizado (menu): " . $product['name'];
            } else {
                // Insertar
                $insertColumns = ['name', 'price', 'category', 'description', 'image', 'ingredients', 'allergens', 'featured', 'active', 'sort_order'];
                $insertValues = [':name', ':price', ':category', ':description', ':image', ':ingredients', ':allergens', ':featured', ':active', ':sort_order'];
                $params['name'] = $product['name'];

                if ($hasPriceUnit && $priceUnitProvided) {
                    $insertColumns[] = 'price_unit';
                    $insertValues[] = ':price_unit';
                    $params['price_unit'] = $priceUnit;
                }

                $sql = 'INSERT INTO menu_products (' . implode(', ', $insertColumns) . ') VALUES (' . implode(', ', $insertValues) . ')';
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $results[] = "Insertado (menu): " . $product['name'];
            }
        }
    }

    echo json_encode(['success' => true, 'results' => $results], JSON_PRETTY_PRINT);

} catch (Throwable $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
