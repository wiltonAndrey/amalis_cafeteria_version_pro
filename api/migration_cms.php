<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

try {
  $pdo->exec(
    "CREATE TABLE IF NOT EXISTS hero (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT NOT NULL,
      quote TEXT DEFAULT NULL,
      background_image VARCHAR(255) NOT NULL
    )"
  );

  $pdo->exec(
    "CREATE TABLE IF NOT EXISTS features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(255) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    )"
  );

  $pdo->exec(
    "CREATE TABLE IF NOT EXISTS philosophy (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image VARCHAR(255) NOT NULL
    )"
  );

  $pdo->exec(
    "CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(120) NOT NULL,
      content TEXT NOT NULL,
      avatar_url VARCHAR(255) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    )"
  );

  $pdo->exec(
    "CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(64) NOT NULL UNIQUE,
      setting_value TEXT NOT NULL
    )"
  );

  $heroCount = (int) $pdo->query('SELECT COUNT(*) FROM hero')->fetchColumn();
  if ($heroCount === 0) {
    $stmt = $pdo->prepare(
      'INSERT INTO hero (title, subtitle, quote, background_image) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([
      'El Corazón de Santa Pola, Sin Atajos.',
      'Aquí huele a pan recién hecho desde bien temprano.',
      'La verdadera artesanía no tiene modo rápido.',
      '/images/editada-19.webp',
    ]);
  }

  $featuresCount = (int) $pdo->query('SELECT COUNT(*) FROM features')->fetchColumn();
  if ($featuresCount === 0) {
    $features = [
      [
        'Tradición',
        'Creemos que la tradición es el alma de cada receta que sale del horno.',
        '/images/editada-02.webp',
        1,
      ],
      [
        'Sin Atajos',
        'Cero procesos industriales. Solo ingredientes reales y paciencia.',
        '/images/editada-23.webp',
        2,
      ],
      [
        '100% Manos Vecinas',
        'Amasamos, horneamos y servimos cada día con orgullo local.',
        '/images/editada-32.webp',
        3,
      ],
      [
        'Café de Especialidad',
        'Seleccionamos granos de origen y los tratamos con respeto.',
        '/images/editada-38.webp',
        4,
      ],
    ];

    $stmt = $pdo->prepare(
      'INSERT INTO features (title, description, icon, sort_order) VALUES (?, ?, ?, ?)'
    );
    foreach ($features as $feature) {
      $stmt->execute($feature);
    }
  }

  $philosophyCount = (int) $pdo->query('SELECT COUNT(*) FROM philosophy')->fetchColumn();
  if ($philosophyCount === 0) {
    $stmt = $pdo->prepare(
      'INSERT INTO philosophy (title, content, image) VALUES (?, ?, ?)'
    );
    $stmt->execute([
      'Una experiencia sensorial',
      '<p>En Amalis cuidamos cada detalle para que el pan y el café sepan a casa.</p><p>Fermentaciones lentas, hornos calientes y manos artesanas. Sin atajos, solo tiempo y pasión.</p>',
      '/images/editada-10.webp',
    ]);
  }

  $testimonialsCount = (int) $pdo->query('SELECT COUNT(*) FROM testimonials')->fetchColumn();
  if ($testimonialsCount === 0) {
    $testimonials = [
      [
        'María Gómez',
        'Cliente Habitual',
        'Me encanta este sitio: el trato amable y el ambiente acogedor lo convierten en un imprescindible en Santa Pola. Sus bocadillos son tremendos.',
        '/images/testimonials/editada-1407-2.webp',
        1,
      ],
      [
        'Jorge Rocamora',
        'Primera Visita',
        'Cafetería Amalis superó todas mis expectativas. Buscaba un desayuno sencillo pero delicioso, y encontré un ambiente acogedor y un servicio tan amable que sin duda repetiré.',
        '/images/testimonials/editada-1415-3.webp',
        2,
      ],
      [
        'Laura Jiménez',
        'Local Guide',
        'Cada mañana es un auténtico placer; su variada oferta de pastelería artesanal dulce y salada, junto a un café de calidad, hacen de este rincón el lugar perfecto.',
        '/images/testimonials/editada-1421-2.webp',
        3,
      ],
      [
        'BJ N',
        'Cliente',
        'Tiene un ambiente limpio y espacioso, un personal muy amable y una excelente selección de pastelería artesanal. Ideal tanto para disfrutar en el local o para llevar.',
        '/images/testimonials/editada-1424-2.webp',
        4,
      ],
    ];

    $stmt = $pdo->prepare(
      'INSERT INTO testimonials (name, role, content, avatar_url, sort_order) VALUES (?, ?, ?, ?, ?)'
    );
    foreach ($testimonials as $testimonial) {
      $stmt->execute($testimonial);
    }
  }

  $settingsDefaults = [
    'site_name' => 'Amalis',
    'logo_url' => '',
    'footer_text' => 'Hecho con amor y café.',
    'opening_hours' => 'Lunes - Domingo · 07:00 - 21:00',
    'contact_address' => 'Visítanos en Santa Pola',
    'contact_phone' => '',
    'contact_email' => '',
    'social_instagram' => 'https://instagram.com/amaliscafeteria',
    'social_facebook' => 'https://facebook.com/amaliscafeteria',
    'social_twitter' => 'https://twitter.com/amaliscafeteria',
  ];

  $insertSetting = $pdo->prepare(
    'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)'
  );

  foreach ($settingsDefaults as $key => $value) {
    $insertSetting->execute([$key, $value]);
  }

  echo "CMS migration completed.\n";
} catch (Throwable $error) {
  echo "CMS migration failed: " . $error->getMessage() . "\n";
}
