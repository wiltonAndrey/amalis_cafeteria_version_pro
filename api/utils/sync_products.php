<?php
/**
 * Utilidad de Sincronización de Productos Masiva
 * Permite al Agente de IA subir o actualizar productos desde un JSON.
 */

$config = require __DIR__ . '/../db_config.php';

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

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

            $params = [
                'name' => $product['name'],
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
                $sql = "UPDATE menu_products SET 
                            price = :price, 
                            category = :category, 
                            description = :description, 
                            image = :image, 
                            ingredients = :ingredients,
                            allergens = :allergens,
                            featured = :featured,
                            active = :active,
                            sort_order = :sort_order
                        WHERE id = :id";
                $params['id'] = $existing['id'];
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $results[] = "Actualizado (menu): " . $product['name'];
            } else {
                // Insertar
                $sql = "INSERT INTO menu_products 
                            (name, price, category, description, image, ingredients, allergens, featured, active, sort_order) 
                        VALUES 
                            (:name, :price, :category, :description, :image, :ingredients, :allergens, :featured, :active, :sort_order)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $results[] = "Insertado (menu): " . $product['name'];
            }
        }
    }

    echo json_encode(['success' => true, 'results' => $results], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
