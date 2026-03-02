import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('preview router performance', () => {
  it('compresses text responses when the client accepts gzip and marks cacheable build assets', () => {
    const routerPath = path.resolve(__dirname, '../../scripts/preview-router.php');
    const routerSource = readFileSync(routerPath, 'utf8');

    expect(routerSource).toContain('HTTP_ACCEPT_ENCODING');
    expect(routerSource).toContain('Content-Encoding: gzip');
    expect(routerSource).toContain('Vary: Accept-Encoding');
    expect(routerSource).toContain('Cache-Control: public, max-age=31536000, immutable');
    expect(routerSource).toContain('Cache-Control: no-cache');
  });
});
