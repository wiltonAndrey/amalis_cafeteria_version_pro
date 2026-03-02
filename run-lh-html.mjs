import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'fs';

const BASE_DIR = 'docs/reports/lighthouse-final-check';
mkdirSync(BASE_DIR, { recursive: true });

const RUNS = [
    { url: 'http://127.0.0.1:4180/', form: 'desktop', name: 'home-desktop-html' }
];

for (const run of RUNS) {
    let chrome;
    try {
        chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

        const r = await lighthouse(run.url, {
            port: chrome.port,
            output: 'html',
            formFactor: run.form,
            screenEmulation: run.form === 'mobile'
                ? { mobile: true, width: 360, height: 640, deviceScaleFactor: 2.625, disabled: false }
                : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
        });

        const outPath = `${BASE_DIR}/${run.name}.html`;
        writeFileSync(outPath, r.report);
        console.log(`Saved HTML report to ${outPath}`);
    } catch (e) {
        console.error(e);
    } finally {
        try { await chrome?.kill(); } catch { }
    }
}
