<?php

function temp_db_config(): array
{
  return require dirname(__DIR__, 2) . '/db_config.php';
}

function temp_db_admin_pdo(): PDO
{
  $config = temp_db_config();

  return new PDO(
    sprintf('mysql:host=%s;charset=utf8mb4', $config['host']),
    $config['user'],
    $config['pass'],
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
}

function temp_db_create(string $prefix): array
{
  $config = temp_db_config();
  $adminPdo = temp_db_admin_pdo();
  $dbName = sprintf('tmp_%s_%s', $prefix, bin2hex(random_bytes(4)));

  $adminPdo->exec(sprintf('CREATE DATABASE `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', str_replace('`', '``', $dbName)));

  putenv('DB_HOST=' . $config['host']);
  putenv('DB_NAME=' . $dbName);
  putenv('DB_USER=' . $config['user']);
  putenv('DB_PASS=' . $config['pass']);

  $pdo = new PDO(
    sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $dbName),
    $config['user'],
    $config['pass'],
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );

  return [$adminPdo, $pdo, $dbName];
}

function temp_db_drop(PDO $adminPdo, string $dbName): void
{
  $adminPdo->exec(sprintf('DROP DATABASE IF EXISTS `%s`', str_replace('`', '``', $dbName)));
}

function temp_db_create_legacy_menu_schema(PDO $pdo): void
{
  $pdo->exec(
    "CREATE TABLE menu_categories (
      id VARCHAR(32) PRIMARY KEY,
      label VARCHAR(64) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      active TINYINT(1) NOT NULL DEFAULT 1,
      visible_in_menu TINYINT(1) NOT NULL DEFAULT 1
    )"
  );

  $pdo->exec(
    "CREATE TABLE menu_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(32) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(255) NOT NULL,
      alt_text VARCHAR(255) DEFAULT NULL,
      image_title VARCHAR(255) DEFAULT NULL,
      ingredients JSON NOT NULL,
      allergens JSON NOT NULL,
      featured TINYINT(1) NOT NULL DEFAULT 0,
      active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0
    )"
  );

  $pdo->exec(
    "CREATE TABLE products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      price_text VARCHAR(40) NOT NULL,
      category VARCHAR(16) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      image_alt VARCHAR(255) DEFAULT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0
    )"
  );

  $pdo->exec(
    "CREATE TABLE promotion_cards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      badge VARCHAR(80) NOT NULL,
      title VARCHAR(120) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(255) NOT NULL,
      image_alt VARCHAR(255) NOT NULL,
      image_title VARCHAR(255) NOT NULL,
      items JSON NOT NULL,
      availability_text VARCHAR(120) NOT NULL,
      cta_label VARCHAR(80) NOT NULL,
      cta_url VARCHAR(255) NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0
    )"
  );
}

function temp_db_seed_get_products_dependencies(PDO $pdo): void
{
  $pdo->exec("INSERT INTO products (name, description, price_text, category, image_url, image_alt, active, sort_order)
    VALUES ('Cafe de prueba', 'Desc', '2,50 €', 'Coffee', '/images/test.webp', 'Cafe test', 1, 1)");

  $pdo->exec("INSERT INTO promotion_cards (badge, title, price, description, image, image_alt, image_title, items, availability_text, cta_label, cta_url, active, sort_order)
    VALUES ('Test', 'Promo test', 3.50, 'Promo', '/images/test.webp', 'Promo alt', 'Promo title', JSON_ARRAY('Cafe'), 'Siempre', 'Ver', '/carta', 1, 1)");
}
