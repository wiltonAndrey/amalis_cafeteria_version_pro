import { readFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const PAYLOAD_PATH = path.join(PROJECT_ROOT, 'docs', 'reports', 'menu-copy-sync-payload.json');

describe('menu copy sync payload (bebidas taxonomy)', () => {
  it('maps cafe copy sections to category bebidas with beverage subcategories', () => {
    const run = spawnSync(process.execPath, ['scripts/sync_menu_from_copy.mjs', '--no-sync'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });

    expect(run.status, `stdout:\n${run.stdout}\nstderr:\n${run.stderr}`).toBe(0);

    const payload = JSON.parse(readFileSync(PAYLOAD_PATH, 'utf8'));
    const categories = Array.isArray(payload.menuCategories) ? payload.menuCategories : [];
    const products = Array.isArray(payload.products) ? payload.products : [];

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'bebidas', label: 'Bebidas' }),
      ]),
    );

    const beverageNames = [
      'Infusión',
      'Infusión Especial',
      'Café Solo',
      'Café Cortado',
      'Café con Leche',
      'Bombón',
      'Americano',
      'Cola Cao',
      'Carajillo',
      'Belmonte',
      'Capuchino',
    ];

    for (const name of beverageNames) {
      const product = products.find((item: any) => item?.name === name);
      expect(product, `missing ${name} in sync payload`).toBeTruthy();
      expect(product.category).toBe('bebidas');
    }

    expect(products.find((item: any) => item?.name === 'Infusión')?.subcategory).toBe('infusiones');
    expect(products.find((item: any) => item?.name === 'Infusión Especial')?.subcategory).toBe('infusiones');
    expect(products.find((item: any) => item?.name === 'Cola Cao')?.subcategory).toBe('cacao');
    expect(products.find((item: any) => item?.name === 'Capuchino')?.subcategory).toBe('cafes');
  });
});
