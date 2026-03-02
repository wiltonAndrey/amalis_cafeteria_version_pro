import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('menu taxonomy schema seed', () => {
  const schemaPath = path.resolve(__dirname, '../../api/schema.sql');
  const schemaSource = readFileSync(schemaPath, 'utf8');

  it('uses the simplified menu categories in the seed data', () => {
    expect(schemaSource).toContain('visible_in_menu TINYINT(1) NOT NULL DEFAULT 1');
    expect(schemaSource).toContain("('all', 'Todos', 0, 1, 1)");
    expect(schemaSource).toContain("('tostadas', 'Tostadas', 1, 1, 1)");
    expect(schemaSource).toContain("('bolleria_dulce', 'Boller");
    expect(schemaSource).toContain("('bolleria_salada', 'Boller");
    expect(schemaSource).toContain("('pasteleria', 'Pasteler");
    expect(schemaSource).toContain("('ofertas', 'Ofertas', 5, 0, 0)");
    expect(schemaSource).toContain("('bebidas', 'Bebidas', 6, 1, 1)");

    expect(schemaSource).not.toContain("('cocas', 'Cocas'");
    expect(schemaSource).not.toContain("('empanadillas', 'Empanadillas'");
    expect(schemaSource).not.toContain("('bolleria', 'Boller");
    expect(schemaSource).not.toContain("('bizcochos', 'Bizcochos'");
    expect(schemaSource).not.toContain("('pasteles', 'Pasteles'");
    expect(schemaSource).not.toContain("('cafes', 'Caf");
  });

  it('reassigns seeded menu products to the new categories', () => {
    expect(schemaSource).toContain("('Coca de Mollitas', 1.50, 'bolleria_salada'");
    expect(schemaSource).toContain("('Coca de Verdura', 2.50, 'bolleria_salada'");
    expect(schemaSource).toContain("('Empanadilla de Pisto', 1.80, 'bolleria_salada'");
    expect(schemaSource).toContain("('Croissant de Mantequilla', 1.40, 'bolleria_dulce'");
    expect(schemaSource).toContain("('Bizcocho de Yogur y Lim");
    expect(schemaSource).toContain(", 'bolleria_dulce', NULL, 'Bizcocho esponjoso ideal");
    expect(schemaSource).toContain("('Tostada de Tomate y AOVE', 2.80, 'tostadas'");
    expect(schemaSource).toContain("('Pack Desayuno Amalis', 4.50, 'ofertas'");
  });

  it('adds subcategory support and seeds bebidas products with derived subcategories', () => {
    expect(schemaSource).toContain('subcategory VARCHAR(32)');
    expect(schemaSource).toContain('ADD COLUMN subcategory VARCHAR(32)');

    expect(schemaSource).toContain("('Infusi");
    expect(schemaSource).toContain(", 'bebidas', 'infusiones', 'Infusi");

    expect(schemaSource).toContain("('Cola Cao', 1.80, 'bebidas', 'cacao'");
    expect(schemaSource).toContain("('Capuchino', 2.75, 'bebidas', 'cafes'");
    expect(schemaSource).toContain("('Zumo de Naranja', 2.50, 'bebidas', 'zumos'");
  });
});
