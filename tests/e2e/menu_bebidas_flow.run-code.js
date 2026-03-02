async (page) => {
  const result = {
    url: 'http://127.0.0.1:3000/carta',
    checks: [],
    timestamp: new Date().toISOString(),
  };

  const record = (name, ok, details = '') => {
    result.checks.push({ name, ok, details });
    if (!ok) {
      throw new Error(`${name}: ${details || 'failed'}`);
    }
  };

  await page.goto(result.url, { waitUntil: 'domcontentloaded' });
  await page.setViewportSize({ width: 1280, height: 800 });

  const menuNav = page.getByRole('navigation', { name: /categor/i });
  await menuNav.waitFor({ state: 'visible', timeout: 15000 });
  record('menu-nav-visible', true);

  const bebidasButton = page.getByRole('button', { name: 'Bebidas', exact: true });
  await bebidasButton.click();

  const subcategoryGroup = page.getByRole('group', { name: /subcategor/i });
  await subcategoryGroup.waitFor({ state: 'visible', timeout: 10000 });
  record('bebidas-subcategory-group-visible', true);

  const cafesFilter = page.locator('button').filter({ hasText: 'Caf' }).first();
  await cafesFilter.click();
  await page.waitForTimeout(900);

  const cafeSoloCardTitle = page.locator('h3').filter({ hasText: 'Solo' }).first();
  const infusionCardTitle = page.locator('h3').filter({ hasText: 'Infusi' }).first();
  const colaCaoCardTitle = page.locator('h3').filter({ hasText: 'Cola Cao' }).first();

  record('cafes-filter-shows-cafe-solo', await cafeSoloCardTitle.isVisible().catch(() => false), 'cafe solo title not visible');
  record('cafes-filter-hides-infusion', !(await infusionCardTitle.isVisible().catch(() => false)), 'infusion title still visible');
  record('cafes-filter-hides-cola-cao', !(await colaCaoCardTitle.isVisible().catch(() => false)), 'cola cao title still visible');

  const tostadasButton = page.getByRole('button', { name: 'Tostadas', exact: true });
  await tostadasButton.click();
  await page.waitForTimeout(900);

  const anyTostadaCardTitle = page.locator('h3').filter({ hasText: 'Tostada' }).first();
  record('regression-tostadas-still-visible', await anyTostadaCardTitle.isVisible().catch(() => false), 'no tostada card visible');
  record('regression-cafe-hidden-when-tostadas', !(await cafeSoloCardTitle.isVisible().catch(() => false)), 'cafe solo title visible in tostadas');

  await page.screenshot({ path: 'output/playwright/menu-bebidas-e2e-script.png', fullPage: true });
  result.screenshot = 'output/playwright/menu-bebidas-e2e-script.png';

  return result;
}
