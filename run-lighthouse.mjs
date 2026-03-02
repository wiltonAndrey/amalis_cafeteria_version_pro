import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'fs';

const BASE_DIR = 'docs/reports/lighthouse-final-check';
mkdirSync(BASE_DIR, { recursive: true });

const RUNS = [
    { url: 'http://127.0.0.1:4180/', form: 'desktop', name: 'home-desktop-full' }
];

const counters = {};
const results = [];

for (const run of RUNS) {
    counters[run.name] = (counters[run.name] || 0) + 1;
    const idx = counters[run.name];
    const label = `${run.name}-${idx}`;

    let chrome;
    try {
        chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

        // Use default pass configuration for full audits
        const r = await lighthouse(run.url, {
            port: chrome.port,
            output: 'json',
            formFactor: run.form,
            screenEmulation: run.form === 'mobile'
                ? { mobile: true, width: 360, height: 640, deviceScaleFactor: 2.625, disabled: false }
                : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
        });

        const outPath = `${BASE_DIR}/${label}.json`;
        writeFileSync(outPath, r.report);

        const cats = JSON.parse(r.report).categories;
        const scores = {
            label,
            perf: Math.round(cats.performance.score * 100),
            acc: Math.round(cats.accessibility.score * 100),
            bp: Math.round(cats['best-practices'].score * 100),
            seo: Math.round(cats.seo.score * 100),
            lcp: JSON.parse(r.report).audits['largest-contentful-paint']?.numericValue,
        };
        results.push(scores);
        console.log(`${label}: Perf=${scores.perf} Acc=${scores.acc} BP=${scores.bp} SEO=${scores.seo} LCP=${Math.round(scores.lcp)}ms`);

        const lcpElement = JSON.parse(r.report).audits['largest-contentful-paint-element'];
        console.log('LCP Element snippet:', lcpElement?.details?.items[0]?.node?.snippet);
    } catch (e) {
        console.error(`${label} error: ${e.message}`);
        results.push({ label, error: e.message });
    } finally {
        try { await chrome?.kill(); } catch { }
    }
}

console.log('\nDone.');
