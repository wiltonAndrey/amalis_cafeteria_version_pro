import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('vite performance config', () => {
  it('does not force framer-motion into a global manual chunk', () => {
    const configPath = path.resolve(__dirname, '../../vite.config.ts');
    const configSource = readFileSync(configPath, 'utf8');

    expect(configSource).not.toContain("'vendor-motion': ['framer-motion']");
    expect(configSource).not.toContain("\"vendor-motion\": ['framer-motion']");
    expect(configSource).not.toContain("\"vendor-motion\": [\"framer-motion\"]");
  });
});
