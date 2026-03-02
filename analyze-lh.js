import { readFileSync } from 'fs';
const r = JSON.parse(readFileSync('docs/reports/lighthouse-f45-shell-final/carta-mobile-1.json', 'utf8'));
const a = r.audits;

// Network requests
const nr = a['network-requests'];
if (nr?.details?.items) {
    console.log('=== NETWORK REQUESTS FOR /carta mobile ===');
    nr.details.items
        .filter(i => i.url.includes('.js') || i.url.includes('.css'))
        .forEach(i => {
            console.log(`  ${i.url.replace(/.*\/assets\//, '')} | ${Math.round(i.transferSize / 1024)}KB | ${Math.round(i.endTime - i.startTime)}ms | priority=${i.priority}`);
        });
}
