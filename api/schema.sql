CREATE TABLE IF NOT EXISTS menu_categories (
  id VARCHAR(32) PRIMARY KEY,
  label VARCHAR(64) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(32) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  ingredients JSON NOT NULL,
  allergens JSON NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price_text VARCHAR(40) NOT NULL,
  category VARCHAR(16) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(64) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELETE FROM menu_categories;
INSERT INTO menu_categories (id, label, sort_order) VALUES
  ('all', 'Todos', 0),
  ('cocas', 'Cocas', 1),
  ('empanadillas', 'Empanadillas', 2),
  ('bolleria', 'Bollería', 3),
  ('bizcochos', 'Bizcochos', 4),
  ('pasteles', 'Pasteles', 5),
  ('tostadas', 'Tostadas', 6),
  ('ofertas', 'Ofertas', 7);

DELETE FROM menu_products;
INSERT INTO menu_products (name, price, category, description, image, ingredients, allergens, featured, active, sort_order) VALUES
  ('Coca de Mollitas', 1.50, 'cocas', 'La clásica coca alicantina con su característica capa crujiente de harina y aceite.', '/images/products/Coca-Sardina.webp', JSON_ARRAY('Harina de trigo', 'Aceite de oliva', 'Vino blanco', 'Sal'), JSON_ARRAY('Gluten'), 1, 1, 1),
  ('Coca de Verdura', 2.50, 'cocas', 'Deliciosa masa artesanal cubierta con pimiento, tomate y cebolla asada.', '/images/products/Coca-Pisto.webp', JSON_ARRAY('Harina', 'Pimiento rojo', 'Tomate', 'Cebolla', 'Aceite'), JSON_ARRAY('Gluten'), 1, 1, 2),
  ('Empanadilla de Pisto', 1.80, 'empanadillas', 'Rellena de nuestro pisto casero elaborado a fuego lento.', '/images/products/Empanada-Pisto.webp', JSON_ARRAY('Tomate', 'Pimiento', 'Huevo duro', 'Atún'), JSON_ARRAY('Gluten', 'Pescado', 'Huevo'), 0, 1, 3),
  ('Croissant de Mantequilla', 1.40, 'bolleria', 'Hojaldre artesanal con auténtica mantequilla, crujiente por fuera y tierno por dentro.', '/images/products/Croissant-Mantequilla.webp', JSON_ARRAY('Harina', 'Mantequilla', 'Leche', 'Azúcar'), JSON_ARRAY('Gluten', 'Lácteos'), 0, 1, 4),
  ('Bizcocho de Yogur y Limón', 12.00, 'bizcochos', 'Bizcocho esponjoso ideal para compartir en desayunos o meriendas.', '/images/products/Bizcocho.webp', JSON_ARRAY('Huevo', 'Yogur', 'Limón', 'Azúcar', 'Harina'), JSON_ARRAY('Gluten', 'Huevo', 'Lácteos'), 0, 1, 5),
  ('Tostada de Tomate y AOVE', 2.80, 'tostadas', 'Pan artesanal tostado con tomate natural rallado y aceite de oliva virgen extra.', '/images/products/Tostada-Tomate.webp', JSON_ARRAY('Pan artesanal', 'Tomate', 'Aceite de oliva', 'Sal'), JSON_ARRAY('Gluten'), 0, 1, 6),
  ('Pack Desayuno Amalis', 4.50, 'ofertas', 'Café + Zumo de Naranja Natural + Tostada o Pieza de Bollería.', '/images/sections/editada-04.webp', JSON_ARRAY('Varios según elección'), JSON_ARRAY('Varios según elección'), 1, 1, 7);

DELETE FROM products;
INSERT INTO products (name, description, price_text, category, image_url, image_alt, active, sort_order) VALUES
  ('Pan de Masa Madre', 'Pan honesto. Harina, agua, y el ingrediente secreto: paciencia. Fermentación lenta para una corteza dorada y miga tierna.', 'Consultar', 'Bread', '/images/sections/editada-09.webp', 'Hogaza de pan de masa madre artesanal con corteza rústica dorada', 1, 1),
  ('Cocas Artesanas "De la Terreta"', 'Nuestras reinas. Desde la clásica de sardinas hasta las de verduras frescas sobre masa fina. Sabor tradicional de Santa Pola.', 'Desde 3,50 €', 'Pastry', '/images/Coca-Sardina.webp', 'Coca artesana tradicional con verduras frescas y sardinas', 1, 2),
  ('Rollos Tradicionales', 'El dulce que nos define. Receta heredada, hecha a mano. Anís, Vino, Naranja y Huevo. El acompañante perfecto.', '1,50 €', 'Pastry', '/images/editada-1458-2.webp', 'Rollos tradicionales de anís y naranja recién hechos', 1, 3),
  ('Bizcochos Caseros', 'Merendar como antes. Naranja, Chocolate con Nuez, Canela... Sin conservantes. Solo ingredientes reales.', '3,50 €', 'Cake', '/images/products/Bizcocho.webp', 'Bizcocho casero esponjoso de naranja y chocolate', 1, 4);

DELETE FROM settings;
INSERT INTO settings (setting_key, setting_value) VALUES
  ('seo_title', 'Amalis Cafetería | Pan artesanal en Santa Pola'),
  ('seo_description', 'Panadería y cafetería artesanal en Santa Pola. Cocas tradicionales, bollería casera y café de especialidad.'),
  ('hero_title', 'El Corazón de Santa Pola, Sin Atajos.'),
  ('hero_subtitle', 'Aquí huele a pan recién hecho desde bien temprano.'),
  ('hero_quote', 'La verdadera artesanía no tiene modo rápido.'),
  ('contact_address', 'Visítanos en Santa Pola'),
  ('contact_hours', 'Lunes - Domingo · 07:00 - 21:00'),
  ('social_instagram', 'https://instagram.com/amaliscafeteria'),
  ('social_facebook', 'https://facebook.com/amaliscafeteria'),
  ('social_twitter', 'https://twitter.com/amaliscafeteria');
