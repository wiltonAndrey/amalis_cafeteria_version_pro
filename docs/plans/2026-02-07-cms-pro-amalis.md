# CMS Pro Amalis Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **Required techniques:** Use `@test-driven-development` for each new behavior. Use `@systematic-debugging` for any failure in API/React.

**Goal:** Crear un CMS dinámico para Amalis Cafetería que permita gestionar productos, SEO y contenidos desde un panel administrativo, manteniendo el diseño actual y el rendimiento en Hostinger.

**Architecture:** Backend PHP 8.x con API REST y PDO para MySQL. Frontend React + Vite consumiendo la API con un hook `useCMS` y fallback a datos estáticos cuando la API no responde. Datos de menú, destacados y ajustes (SEO, hero, contacto) entregados desde endpoints de lectura.

**Tech Stack:** PHP 8.x, MySQL, React, Vite, Tailwind CSS, Vitest.

---

### Task 1: Conexión DB + bootstrap + CORS

**Files:**
- Create: `api/db_config.php`
- Create: `api/bootstrap.php`
- Create: `api/tests/connection.test.php`

**Step 1: Write the failing test**

```php
<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();
$stmt = $pdo->query('SELECT 1 AS ok');
$row = $stmt->fetch();

if (!isset($row['ok']) || (int) $row['ok'] !== 1) {
  fwrite(STDERR, "FAIL: DB query did not return 1\n");
  exit(1);
}

echo "PASS\n";
```

**Step 2: Run test to verify it fails**

Run: `php api/tests/connection.test.php`  
Expected: FAIL (bootstrap missing or DB connection error).

**Step 3: Write minimal implementation**

`api/db_config.php`
```php
<?php
return [
  'host' => getenv('DB_HOST') ?: 'localhost',
  'name' => getenv('DB_NAME') ?: 'amalis_cms',
  'user' => getenv('DB_USER') ?: 'root',
  'pass' => getenv('DB_PASS') ?: '',
];
```

`api/bootstrap.php`
```php
<?php
$config = require __DIR__ . '/db_config.php';

function get_pdo(): PDO
{
  static $pdo = null;
  if ($pdo) {
    return $pdo;
  }

  $dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=utf8mb4',
    $config['host'],
    $config['name']
  );

  $pdo = new PDO($dsn, $config['user'], $config['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  return $pdo;
}

if (php_sapi_name() !== 'cli') {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}
```

**Step 4: Apply schema**

Run: `mysql -u "%DB_USER%" -p"%DB_PASS%" -h "%DB_HOST%" "%DB_NAME%" < api/schema.sql`  
Expected: command completes without errors.

**Step 5: Run test to verify it passes**

Run: `php api/tests/connection.test.php`  
Expected: PASS.

**Step 6: Commit**

```bash
git add api/db_config.php api/bootstrap.php api/tests/connection.test.php
git commit -m "feat(api): add db config and bootstrap"
```

---

### Task 2: Esquema SQL y validación de tablas

**Files:**
- Create: `api/schema.sql`
- Create: `api/tests/schema.test.php`

**Step 1: Write the failing test**

```php
<?php
require __DIR__ . '/../bootstrap.php';

$pdo = get_pdo();
$tables = ['menu_categories', 'menu_products', 'products', 'settings', 'admins'];
$placeholders = implode(',', array_fill(0, count($tables), '?'));
$stmt = $pdo->prepare(
  "SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = DATABASE()
     AND table_name IN ($placeholders)"
);
$stmt->execute($tables);
$found = $stmt->fetchAll(PDO::FETCH_COLUMN);

$missing = array_diff($tables, $found);
if ($missing) {
  fwrite(STDERR, "FAIL: missing tables: " . implode(', ', $missing) . "\n");
  exit(1);
}

echo "PASS\n";
```

**Step 2: Run test to verify it fails**

Run: `php api/tests/schema.test.php`  
Expected: FAIL with missing tables.

**Step 3: Write minimal implementation**

`api/schema.sql`
```sql
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
  ('Cocas Artesanas \"De la Terreta\"', 'Nuestras reinas. Desde la clásica de sardinas hasta las de verduras frescas sobre masa fina. Sabor tradicional de Santa Pola.', 'Desde 3,50 €', 'Pastry', '/images/Coca-Sardina.webp', 'Coca artesana tradicional con verduras frescas y sardinas', 1, 2),
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
```

**Step 4: Run test to verify it passes**

Run: `php api/tests/schema.test.php`  
Expected: PASS.

**Step 5: Commit**

```bash
git add api/schema.sql api/tests/schema.test.php
git commit -m "feat(api): add cms schema and seed data"
```

---

### Task 3: Endpoint de lectura `get_products.php`

**Files:**
- Create: `api/get_products.php`
- Create: `api/tests/get_products.test.php`

**Step 1: Write the failing test**

```php
<?php
ob_start();
require __DIR__ . '/../get_products.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data)) {
  fwrite(STDERR, "FAIL: invalid JSON\n");
  exit(1);
}

if (empty($data['menuCategories']) || empty($data['menuProducts'])) {
  fwrite(STDERR, "FAIL: missing menu data\n");
  exit(1);
}

if (empty($data['featuredProducts'])) {
  fwrite(STDERR, "FAIL: missing featured products\n");
  exit(1);
}

echo "PASS\n";
```

**Step 2: Run test to verify it fails**

Run: `php api/tests/get_products.test.php`  
Expected: FAIL (file missing or missing keys).

**Step 3: Write minimal implementation**

`api/get_products.php`
```php
<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();

$categories = $pdo->query(
  'SELECT id, label FROM menu_categories ORDER BY sort_order, id'
)->fetchAll();

$menuRows = $pdo->query(
  'SELECT id, name, price, category, description, image, ingredients, allergens, featured
   FROM menu_products
   WHERE active = 1
   ORDER BY sort_order, id'
)->fetchAll();

$menuProducts = array_map(function (array $row): array {
  return [
    'id' => (string) $row['id'],
    'name' => $row['name'],
    'price' => (float) $row['price'],
    'category' => $row['category'],
    'description' => $row['description'],
    'image' => $row['image'],
    'ingredients' => json_decode($row['ingredients'], true) ?: [],
    'allergens' => json_decode($row['allergens'], true) ?: [],
    'featured' => (bool) $row['featured'],
  ];
}, $menuRows);

$featuredRows = $pdo->query(
  'SELECT id, name, description, price_text, category, image_url, image_alt
   FROM products
   WHERE active = 1
   ORDER BY sort_order, id'
)->fetchAll();

$featuredProducts = array_map(function (array $row): array {
  return [
    'id' => (string) $row['id'],
    'name' => $row['name'],
    'description' => $row['description'],
    'price' => $row['price_text'],
    'category' => $row['category'],
    'imageUrl' => $row['image_url'],
    'imageAlt' => $row['image_alt'],
  ];
}, $featuredRows);

echo json_encode([
  'menuCategories' => $categories,
  'menuProducts' => $menuProducts,
  'featuredProducts' => $featuredProducts,
], JSON_UNESCAPED_UNICODE);
```

**Step 4: Run test to verify it passes**

Run: `php api/tests/get_products.test.php`  
Expected: PASS.

**Step 5: Commit**

```bash
git add api/get_products.php api/tests/get_products.test.php
git commit -m "feat(api): add get_products endpoint"
```

---

### Task 4: Endpoint de lectura `get_settings.php`

**Files:**
- Create: `api/get_settings.php`
- Create: `api/tests/get_settings.test.php`

**Step 1: Write the failing test**

```php
<?php
ob_start();
require __DIR__ . '/../get_settings.php';
$json = ob_get_clean();

$data = json_decode($json, true);
if (!is_array($data) || empty($data['seo']) || empty($data['hero'])) {
  fwrite(STDERR, "FAIL: missing settings keys\n");
  exit(1);
}

echo "PASS\n";
```

**Step 2: Run test to verify it fails**

Run: `php api/tests/get_settings.test.php`  
Expected: FAIL (file missing or missing keys).

**Step 3: Write minimal implementation**

`api/get_settings.php`
```php
<?php
require __DIR__ . '/bootstrap.php';

$pdo = get_pdo();
$rows = $pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll();

$map = [];
foreach ($rows as $row) {
  $map[$row['setting_key']] = $row['setting_value'];
}

echo json_encode([
  'seo' => [
    'title' => $map['seo_title'] ?? '',
    'description' => $map['seo_description'] ?? '',
  ],
  'hero' => [
    'title' => $map['hero_title'] ?? '',
    'subtitle' => $map['hero_subtitle'] ?? '',
    'quote' => $map['hero_quote'] ?? '',
  ],
  'contact' => [
    'address' => $map['contact_address'] ?? '',
    'hours' => $map['contact_hours'] ?? '',
  ],
  'social' => [
    'instagram' => $map['social_instagram'] ?? '',
    'facebook' => $map['social_facebook'] ?? '',
    'twitter' => $map['social_twitter'] ?? '',
  ],
], JSON_UNESCAPED_UNICODE);
```

**Step 4: Run test to verify it passes**

Run: `php api/tests/get_settings.test.php`  
Expected: PASS.

**Step 5: Commit**

```bash
git add api/get_settings.php api/tests/get_settings.test.php
git commit -m "feat(api): add get_settings endpoint"
```

---

### Task 5: Hook `useCMS` con fallback

**Files:**
- Create: `src/hooks/useCMS.ts`
- Modify: `src/constants.tsx`
- Modify: `src/test/hooks.test.ts`

**Step 1: Write the failing test**

Add to `src/test/hooks.test.ts`:
```ts
import { useCMS } from '../hooks/useCMS';

describe('useCMS', () => {
  it('returns fallback data immediately', () => {
    const { result } = renderHook(() => useCMS());
    expect(result.current.menuProducts.length).toBeGreaterThan(0);
    expect(result.current.featuredProducts.length).toBeGreaterThan(0);
    expect(result.current.settings.seo.title).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/test/hooks.test.ts`  
Expected: FAIL (hook missing).

**Step 3: Write minimal implementation**

Add to `src/constants.tsx`:
```ts
export const CMS_DEFAULT_SETTINGS = {
  seo: {
    title: 'Amalis Cafetería | Pan artesanal en Santa Pola',
    description: 'Panadería y cafetería artesanal en Santa Pola. Cocas tradicionales, bollería casera y café de especialidad.'
  },
  hero: {
    title: 'El Corazón de Santa Pola, Sin Atajos.',
    subtitle: 'Aquí huele a pan recién hecho desde bien temprano.',
    quote: 'La verdadera artesanía no tiene modo rápido.'
  },
  contact: {
    address: 'Visítanos en Santa Pola',
    hours: 'Lunes - Domingo · 07:00 - 21:00'
  },
  social: {
    instagram: 'https://instagram.com/amaliscafeteria',
    facebook: 'https://facebook.com/amaliscafeteria',
    twitter: 'https://twitter.com/amaliscafeteria'
  }
};
```

Create `src/hooks/useCMS.ts`:
```ts
import { useEffect, useMemo, useState } from 'react';
import { MENU_CATEGORIES, MENU_PRODUCTS, PRODUCTS, CMS_DEFAULT_SETTINGS } from '../constants';

type CmsSettings = typeof CMS_DEFAULT_SETTINGS;

export const useCMS = () => {
  const [menuCategories, setMenuCategories] = useState(MENU_CATEGORIES);
  const [menuProducts, setMenuProducts] = useState(MENU_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState(PRODUCTS);
  const [settings, setSettings] = useState<CmsSettings>(CMS_DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (typeof fetch !== 'function') {
        setLoading(false);
        return;
      }

      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch('/api/get_products.php'),
          fetch('/api/get_settings.php')
        ]);

        if (!productsRes.ok || !settingsRes.ok) {
          throw new Error('CMS fetch failed');
        }

        const productsJson = await productsRes.json();
        const settingsJson = await settingsRes.json();

        if (cancelled) return;

        if (Array.isArray(productsJson.menuCategories)) {
          setMenuCategories(productsJson.menuCategories);
        }
        if (Array.isArray(productsJson.menuProducts)) {
          setMenuProducts(productsJson.menuProducts);
        }
        if (Array.isArray(productsJson.featuredProducts)) {
          setFeaturedProducts(productsJson.featuredProducts);
        }
        if (settingsJson) {
          setSettings({
            seo: settingsJson.seo ?? CMS_DEFAULT_SETTINGS.seo,
            hero: settingsJson.hero ?? CMS_DEFAULT_SETTINGS.hero,
            contact: settingsJson.contact ?? CMS_DEFAULT_SETTINGS.contact,
            social: settingsJson.social ?? CMS_DEFAULT_SETTINGS.social,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError('cms_unavailable');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (settings?.seo?.title) {
      document.title = settings.seo.title;
    }
    const description = settings?.seo?.description;
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) {
        tag.setAttribute('content', description);
      }
    }
  }, [settings]);

  return useMemo(() => ({
    menuCategories,
    menuProducts,
    featuredProducts,
    settings,
    loading,
    error
  }), [menuCategories, menuProducts, featuredProducts, settings, loading, error]);
};
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/test/hooks.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/hooks/useCMS.ts src/constants.tsx src/test/hooks.test.ts
git commit -m "feat(cms): add useCMS hook with fallback data"
```

---

### Task 6: Integrar CMS en la Carta (`Menu`)

**Files:**
- Modify: `src/pages/Menu.tsx`
- Modify: `src/test/integration.test.tsx`

**Step 1: Write the failing test**

Add a fetch stub to `src/test/integration.test.tsx`:
```ts
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/test/integration.test.tsx`  
Expected: FAIL (useCMS not wired yet).

**Step 3: Write minimal implementation**

Update `src/pages/Menu.tsx` to use `useCMS`:
```ts
import { useCMS } from '../hooks/useCMS';

const Menu: React.FC = () => {
  const { menuCategories, menuProducts } = useCMS();
  ...
  const filteredProducts = useMemo(() => {
    return activeCategory === 'all'
      ? menuProducts
      : menuProducts.filter(p => p.category === activeCategory);
  }, [activeCategory, menuProducts]);
  ...
  {menuCategories.map((cat) => {
    const Icon = CATEGORY_ICONS[cat.id] || Coffee;
    ...
  })}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/test/integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/Menu.tsx src/test/integration.test.tsx
git commit -m "feat(cms): wire menu to useCMS"
```

---

### Task 7: Integrar CMS en Hero, Destacados y Footer

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/sections/FeaturedProducts.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/test/components.test.tsx`

**Step 1: Write the failing test**

Add to `src/test/components.test.tsx`:
```ts
describe('CMS-backed components', () => {
  it('renders hero title from fallback settings', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>);
    expect(screen.getByText(/El Corazón de/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/test/components.test.tsx`  
Expected: FAIL (Hero not using CMS yet).

**Step 3: Write minimal implementation**

Update `src/components/Hero.tsx` to read from `useCMS`:
```ts
import { useCMS } from '../hooks/useCMS';

const Hero: React.FC = () => {
  const { settings } = useCMS();
  const hero = settings.hero;
  ...
  <h1>...</h1>
  <p>{hero.subtitle}</p>
  <p>"{hero.quote}"</p>
```

Update `src/components/sections/FeaturedProducts.tsx`:
```ts
import { useCMS } from '../../hooks/useCMS';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts } = useCMS();
  ...
  {featuredProducts.map((product, idx) => (
    <Reveal key={product.id} ...>
      <ProductCard product={product} />
    </Reveal>
  ))}
```

Update `src/components/Footer.tsx` to use `settings.contact` and `settings.social`:
```ts
import { useCMS } from '../hooks/useCMS';

const Footer: React.FC = () => {
  const { settings } = useCMS();
  const contact = settings.contact;
  const social = settings.social;
  ...
  const SOCIAL_LINKS = [
    { name: 'Instagram', icon: InstagramIcon, href: social.instagram },
    { name: 'Facebook', icon: FacebookIcon, href: social.facebook },
    { name: 'Twitter', icon: TwitterIcon, href: social.twitter },
  ];
  ...
  {contact.address}
  {contact.hours}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/test/components.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/sections/FeaturedProducts.tsx src/components/Footer.tsx src/test/components.test.tsx
git commit -m "feat(cms): wire hero, featured and footer to useCMS"
```

---

### Task 8: Autenticación Admin (login + verify)

**Files:**
- Create: `api/auth/_auth.php`
- Create: `api/auth/login.php`
- Create: `api/auth/verify.php`
- Create: `api/tests/auth.test.php`

**Step 1: Write the failing test**

```php
<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/../auth/_auth.php';

$pdo = get_pdo();
$email = 'admin@example.com';
$password = 'ChangeMe123!';

$pdo->prepare('DELETE FROM admins WHERE email = ?')->execute([$email]);
$hash = password_hash($password, PASSWORD_DEFAULT);
$pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)')->execute([$email, $hash]);

session_start();
$result = login_admin($pdo, $email, $password);
if (empty($result['ok'])) {
  fwrite(STDERR, "FAIL: login failed\n");
  exit(1);
}

$verify = require_auth();
if (empty($verify['ok'])) {
  fwrite(STDERR, "FAIL: verify failed\n");
  exit(1);
}

echo "PASS\n";
```

**Step 2: Run test to verify it fails**

Run: `php api/tests/auth.test.php`  
Expected: FAIL (auth helpers missing).

**Step 3: Write minimal implementation**

`api/auth/_auth.php`
```php
<?php
require __DIR__ . '/../bootstrap.php';

function json_response(array $payload, int $status = 200): void
{
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

function login_admin(PDO $pdo, string $email, string $password): array
{
  $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $admin = $stmt->fetch();

  if (!$admin || !password_verify($password, $admin['password_hash'])) {
    return ['ok' => false];
  }

  $_SESSION['admin_id'] = $admin['id'];
  $_SESSION['admin_email'] = $admin['email'];

  return ['ok' => true, 'admin' => ['id' => $admin['id'], 'email' => $admin['email']]];
}

function require_auth(): array
{
  if (empty($_SESSION['admin_id'])) {
    return ['ok' => false];
  }

  return ['ok' => true, 'admin' => [
    'id' => $_SESSION['admin_id'],
    'email' => $_SESSION['admin_email'] ?? '',
  ]];
}
```

`api/auth/login.php`
```php
<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/_auth.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$email = trim((string) ($body['email'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($email === '' || $password === '') {
  json_response(['ok' => false, 'error' => 'missing_credentials'], 400);
}

$result = login_admin(get_pdo(), $email, $password);
if (!$result['ok']) {
  json_response(['ok' => false, 'error' => 'invalid_credentials'], 401);
}

json_response($result);
```

`api/auth/verify.php`
```php
<?php
require __DIR__ . '/../bootstrap.php';
require __DIR__ . '/_auth.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

$result = require_auth();
if (!$result['ok']) {
  json_response(['ok' => false], 401);
}

json_response($result);
```

**Step 4: Run test to verify it passes**

Run: `php api/tests/auth.test.php`  
Expected: PASS.

**Step 5: Commit**

```bash
git add api/auth/_auth.php api/auth/login.php api/auth/verify.php api/tests/auth.test.php
git commit -m "feat(api): add admin auth endpoints"
```

---

### Task 9: Panel de Administración (Frontend)

**Files:**
- Create: `src/pages/Admin.tsx`
- Create: `src/components/admin/ProductCRUD.tsx`
- Modify: `src/App.tsx`
- Modify: `src/test/components.test.tsx`

**Step 1: Write the failing test**

Add to `src/test/components.test.tsx`:
```ts
import Admin from '../pages/Admin';

describe('Admin page', () => {
  it('renders admin heading', () => {
    render(<MemoryRouter><Admin /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /panel de administración/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/test/components.test.tsx`  
Expected: FAIL (Admin page missing).

**Step 3: Write minimal implementation**

`src/components/admin/ProductCRUD.tsx`
```tsx
import React from 'react';
import { MenuProduct } from '../../types';

interface Props {
  products: MenuProduct[];
}

const ProductCRUD: React.FC<Props> = ({ products }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif text-cream">Productos</h3>
      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cream font-semibold">{product.name}</p>
                <p className="text-cream/60 text-sm">{product.description}</p>
              </div>
              <button className="px-4 py-2 text-xs uppercase tracking-widest text-cream border border-caramel/40 rounded-full">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCRUD;
```

`src/pages/Admin.tsx`
```tsx
import React from 'react';
import { useCMS } from '../hooks/useCMS';
import ProductCRUD from '../components/admin/ProductCRUD';

const Admin: React.FC = () => {
  const { menuProducts, settings } = useCMS();

  return (
    <div className="min-h-screen bg-[var(--color-espresso)] text-[var(--color-cream)] px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <header>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Panel de Administración</h1>
          <p className="text-cream/60 mt-2">Gestiona carta, SEO y datos de contacto.</p>
        </header>

        <ProductCRUD products={menuProducts} />

        <section className="space-y-4">
          <h3 className="text-2xl font-serif text-cream">SEO y Hero</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.seo.title} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.seo.description} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.hero.title} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.hero.subtitle} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-serif text-cream">Contacto</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.contact.address} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.contact.hours} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
```

Update `src/App.tsx` to include route:
```tsx
import Admin from './pages/Admin';
...
<Route path="/admin" element={<Admin />} />
```

**Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/test/components.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/Admin.tsx src/components/admin/ProductCRUD.tsx src/App.tsx src/test/components.test.tsx
git commit -m "feat(admin): add admin dashboard shell"
```

---

## Mejoras de Calidad Incluidas
- Optimización de imágenes vía redimensionamiento en PHP (a implementar en tareas futuras si se añaden endpoints de subida).
- Modo resiliente: fallback a datos estáticos si la API no responde.
- Seguridad pro: PDO con prepared statements, `password_hash` y `password_verify`.

## Plan de Verificación
1. Verificar endpoints: `php api/tests/connection.test.php`, `php api/tests/schema.test.php`, `php api/tests/get_products.test.php`, `php api/tests/get_settings.test.php`.
2. Prueba de fallback: simular `fetch` fallido en tests y confirmar que el frontend renderiza con constantes.
3. Prueba de UI: `npm run test:run` para validar Hero, Carta y Admin.
