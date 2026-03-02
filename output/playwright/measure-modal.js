async (page) => {
  const fs = require('fs');
  const path = require('path');

  const metrics = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
    if (!dialog) {
      return { error: 'dialog-not-found', viewport: { width: window.innerWidth, height: window.innerHeight } };
    }

    const heroShell = dialog.querySelector('[data-testid="product-modal-image-shell"]');
    const heroImg = dialog.querySelector('[data-testid="product-modal-hero-image"]');
    const overlayFx = dialog.querySelector('[data-testid="product-modal-image-overlay"]');
    const closeButton = dialog.querySelector('button[aria-label="Cerrar modal"]');
    const scrollPanel = dialog.querySelector('.custom-scroll');

    const heroTitle = heroShell?.querySelector('h2');
    const heroTextBlock = heroTitle?.parentElement || null;
    const heroCategory = heroTextBlock?.querySelector('span') || null;

    const rect = (el) => {
      if (!el || typeof el.getBoundingClientRect !== 'function') return null;
      const r = el.getBoundingClientRect();
      return {
        x: Number(r.x.toFixed(1)),
        y: Number(r.y.toFixed(1)),
        width: Number(r.width.toFixed(1)),
        height: Number(r.height.toFixed(1)),
        top: Number(r.top.toFixed(1)),
        right: Number(r.right.toFixed(1)),
        bottom: Number(r.bottom.toFixed(1)),
        left: Number(r.left.toFixed(1)),
      };
    };

    const heroRect = heroShell?.getBoundingClientRect() || null;
    const textRect = heroTextBlock?.getBoundingClientRect() || null;
    const titleRect = heroTitle?.getBoundingClientRect() || null;

    const heroTitleStyles = heroTitle ? getComputedStyle(heroTitle) : null;
    const heroImgStyles = heroImg ? getComputedStyle(heroImg) : null;
    const scrollStyles = scrollPanel ? getComputedStyle(scrollPanel) : null;

    const lineHeightPx = heroTitleStyles ? parseFloat(heroTitleStyles.lineHeight || '0') : 0;
    const titleLines = lineHeightPx > 0 && titleRect ? Math.round(titleRect.height / lineHeightPx) : null;

    const overlayCoveragePx = heroRect && textRect ? Math.max(0, heroRect.bottom - textRect.top) : null;
    const overlayCoverageRatio = heroRect && overlayCoveragePx != null
      ? Number((overlayCoveragePx / heroRect.height).toFixed(3))
      : null;

    const gradient = overlayFx?.querySelector('div') || null;
    const tabs = Array.from(dialog.querySelectorAll('button')).map((b) => b.innerText.trim()).filter(Boolean);

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      dialogRect: rect(dialog),
      heroRect: rect(heroShell),
      heroImageRect: rect(heroImg),
      heroTextBlockRect: rect(heroTextBlock),
      heroCategoryRect: rect(heroCategory),
      heroTitleRect: rect(heroTitle),
      heroTitle: heroTitle?.textContent?.trim() || null,
      heroTitleFontSize: heroTitleStyles?.fontSize || null,
      heroTitleLineHeight: heroTitleStyles?.lineHeight || null,
      heroTitleLines: titleLines,
      overlayCoveragePx: overlayCoveragePx != null ? Number(overlayCoveragePx.toFixed(1)) : null,
      overlayCoverageRatio,
      heroImageObjectPosition: heroImg?.style.objectPosition || heroImgStyles?.objectPosition || null,
      heroImageObjectFit: heroImgStyles?.objectFit || null,
      heroShellClasses: heroShell?.className || null,
      overlayClasses: overlayFx?.className || null,
      overlayVariant: overlayFx?.getAttribute('data-overlay-variant') || null,
      gradientClasses: gradient?.className || null,
      closeButtonRect: rect(closeButton),
      scrollPanelRect: rect(scrollPanel),
      scrollPanelOverflowY: scrollStyles?.overflowY || null,
      scrollPanelScrollHeight: scrollPanel?.scrollHeight ?? null,
      scrollPanelClientHeight: scrollPanel?.clientHeight ?? null,
      bodyOverflow: getComputedStyle(document.body).overflow,
      bodyInlineOverflow: document.body.style.overflow,
      tabLabels: tabs,
      activeElementLabel: document.activeElement?.getAttribute?.('aria-label') || document.activeElement?.innerText || null,
    };
  });

  const outDir = path.resolve(process.cwd(), 'output/playwright');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const suffix = `${metrics.viewport?.width || 'x'}x${metrics.viewport?.height || 'y'}`;
  const outFile = path.join(outDir, `modal-metrics-${suffix}.json`);
  fs.writeFileSync(outFile, JSON.stringify(metrics, null, 2));
}
