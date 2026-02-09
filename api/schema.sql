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
  alt_text VARCHAR(255) DEFAULT NULL,
  image_title VARCHAR(255) DEFAULT NULL,
  ingredients JSON NOT NULL,
  allergens JSON NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
);

SET @add_alt_text = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'menu_products'
        AND COLUMN_NAME = 'alt_text'
    ),
    'SELECT 1',
    'ALTER TABLE menu_products ADD COLUMN alt_text VARCHAR(255) DEFAULT NULL AFTER image'
  )
);
PREPARE add_alt_text_stmt FROM @add_alt_text;
EXECUTE add_alt_text_stmt;
DEALLOCATE PREPARE add_alt_text_stmt;

SET @add_image_title = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'menu_products'
        AND COLUMN_NAME = 'image_title'
    ),
    'SELECT 1',
    'ALTER TABLE menu_products ADD COLUMN image_title VARCHAR(255) DEFAULT NULL AFTER alt_text'
  )
);
PREPARE add_image_title_stmt FROM @add_image_title;
EXECUTE add_image_title_stmt;
DEALLOCATE PREPARE add_image_title_stmt;

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

CREATE TABLE IF NOT EXISTS hero (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  quote TEXT DEFAULT NULL,
  background_image VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS promotion_cards (
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
);

CREATE TABLE IF NOT EXISTS philosophy (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  avatar_url VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
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

DELETE FROM promotion_cards;
INSERT INTO promotion_cards (badge, title, price, description, image, image_alt, image_title, items, availability_text, cta_label, cta_url, active, sort_order) VALUES
  ('Mananas', 'Desayuno Completo', 3.50, 'Empieza el dia con energia. Cafe de especialidad y zumo natural.', '/images/sections/editada-04.webp', 'Desayuno completo con cafe, zumo y tostada artesanal', 'Pack desayuno completo Amalis', JSON_ARRAY('Cafe de especialidad', 'Zumo de naranja', 'Tostada artesana'), 'Hasta 12:00', 'Ver desayuno', '/carta', 1, 1),
  ('Mediodia', 'Almuerzo', 5.00, 'La pausa perfecta con bocadillo en pan artesano y bebida fria.', '/images/products/pizza-york.webp', 'Almuerzo con bocadillo artesanal y bebida fria', 'Pack almuerzo Amalis', JSON_ARRAY('Bocadillo artesano', 'Cerveza o Refresco'), 'Lun - Vie', 'Ver almuerzo', '/carta', 1, 2),
  ('Tardes', 'Merienda Dulce', 4.00, 'Granizado de limon natural con una seleccion dulce para la tarde.', '/images/products/Bizcocho.webp', 'Merienda dulce con granizado natural y fartons', 'Pack merienda dulce Amalis', JSON_ARRAY('Granizado natural', '3 Fartons tiernos'), 'Tardes', 'Ver merienda', '/carta', 1, 3);

DELETE FROM hero;
INSERT INTO hero (title, subtitle, quote, background_image) VALUES
  ('El Corazón de Santa Pola, Sin Atajos.', 'Aquí huele a pan recién hecho desde bien temprano.', 'La verdadera artesanía no tiene modo rápido.', '/images/editada-19.webp');

DELETE FROM features;
INSERT INTO features (title, description, icon, sort_order) VALUES
  ('Tradición', 'Creemos que la tradición es el alma de cada receta que sale del horno.', '/images/editada-02.webp', 1),
  ('Sin Atajos', 'Cero procesos industriales. Solo ingredientes reales y paciencia.', '/images/editada-23.webp', 2),
  ('100% Manos Vecinas', 'Amasamos, horneamos y servimos cada día con orgullo local.', '/images/editada-32.webp', 3),
  ('Café de Especialidad', 'Seleccionamos granos de origen y los tratamos con respeto.', '/images/editada-38.webp', 4);

DELETE FROM philosophy;
INSERT INTO philosophy (title, content, image) VALUES
  ('Una experiencia sensorial', '<p>En Amalis cuidamos cada detalle para que el pan y el café sepan a casa.</p><p>Fermentaciones lentas, hornos calientes y manos artesanas. Sin atajos, solo tiempo y pasión.</p>', '/images/editada-10.webp');

DELETE FROM testimonials;
INSERT INTO testimonials (name, role, content, avatar_url, sort_order) VALUES
  ('María Gómez', 'Cliente Habitual', 'Me encanta este sitio: el trato amable y el ambiente acogedor lo convierten en un imprescindible en Santa Pola. Sus bocadillos son tremendos.', '/images/testimonials/editada-1407-2.webp', 1),
  ('Jorge Rocamora', 'Primera Visita', 'Cafetería Amalis superó todas mis expectativas. Buscaba un desayuno sencillo pero delicioso, y encontré un ambiente acogedor y un servicio tan amable que sin duda repetiré.', '/images/testimonials/editada-1415-3.webp', 2),
  ('Laura Jiménez', 'Local Guide', 'Cada mañana es un auténtico placer; su variada oferta de pastelería artesanal dulce y salada, junto a un café de calidad, hacen de este rincón el lugar perfecto.', '/images/testimonials/editada-1421-2.webp', 3),
  ('BJ N', 'Cliente', 'Tiene un ambiente limpio y espacioso, un personal muy amable y una excelente selección de pastelería artesanal. Ideal tanto para disfrutar en el local o para llevar.', '/images/testimonials/editada-1424-2.webp', 4);

DELETE FROM settings;
INSERT INTO settings (setting_key, setting_value) VALUES
  ('seo_title', 'Amalis Cafetería | Pan artesanal en Santa Pola'),
  ('seo_description', 'Panadería y cafetería artesanal en Santa Pola. Cocas tradicionales, bollería casera y café de especialidad.'),
  ('hero_title', 'El Corazón de Santa Pola, Sin Atajos.'),
  ('hero_subtitle', 'Aquí huele a pan recién hecho desde bien temprano.'),
  ('hero_quote', 'La verdadera artesanía no tiene modo rápido.'),
  ('site_name', 'Amalis'),
  ('logo_url', ''),
  ('footer_text', 'Hecho con amor y café.'),
  ('contact_address', 'Visítanos en Santa Pola'),
  ('contact_hours', 'Lunes - Domingo · 07:00 - 21:00'),
  ('opening_hours', 'Lunes - Domingo · 07:00 - 21:00'),
  ('contact_phone', ''),
  ('contact_email', ''),
  ('social_instagram', 'https://instagram.com/amaliscafeteria'),
  ('social_facebook', 'https://facebook.com/amaliscafeteria'),
  ('social_twitter', 'https://twitter.com/amaliscafeteria');
