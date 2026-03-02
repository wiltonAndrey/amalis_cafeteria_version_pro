(() => {
  const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
  if (!dialog) return { error: 'dialog-not-found', viewport: { width: window.innerWidth, height: window.innerHeight } };

  const heroShell = dialog.querySelector('[data-testid="product-modal-image-shell"]');
  const heroImg = dialog.querySelector('[data-testid="product-modal-hero-image"]');
  const overlayFx = dialog.querySelector('[data-testid="product-modal-image-overlay"]');
  const closeButton = dialog.querySelector('button[aria-label="Cerrar modal"]');
  const scrollPanel = dialog.querySelector('.custom-scroll');
  const heroTitle = heroShell?.querySelector('h2');
  const heroTextBlock = heroTitle?.parentElement || null;
  const heroCategory = heroTextBlock?.querySelector('span') || null;
  const gradient = overlayFx?.querySelector('div') || null;

  const rect = (el) => {
    if (!el || typeof el.getBoundingClientRect !== 'function') return null;
    const r = el.getBoundingClientRect();
    return {
      x: Number(r.x.toFixed(1)),
      y: Number(r.y.toFixed(1)),
      width: Number(r.width.toFixed(1)),
      height: Number(r.height.toFixed(1)),
      top: Number(r.top.toFixed(1)),
      bottom: Number(r.bottom.toFixed(1)),
      left: Number(r.left.toFixed(1)),
      right: Number(r.right.toFixed(1)),
    };
  };

  const heroRect = heroShell?.getBoundingClientRect();
  const textRect = heroTextBlock?.getBoundingClientRect();
  const titleRect = heroTitle?.getBoundingClientRect();
  const titleStyles = heroTitle ? getComputedStyle(heroTitle) : null;
  const imgStyles = heroImg ? getComputedStyle(heroImg) : null;
  const scrollStyles = scrollPanel ? getComputedStyle(scrollPanel) : null;
  const lineHeightPx = titleStyles ? parseFloat(titleStyles.lineHeight || '0') : 0;
  const titleLines = lineHeightPx > 0 && titleRect ? Math.round(titleRect.height / lineHeightPx) : null;
  const overlayCoveragePx = heroRect && textRect ? Math.max(0, heroRect.bottom - textRect.top) : null;

  return {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    heroShellClasses: heroShell?.className || null,
    heroRect: rect(heroShell),
    heroTitle: heroTitle?.textContent?.trim() || null,
    heroTextBlockRect: rect(heroTextBlock),
    heroCategoryRect: rect(heroCategory),
    heroTitleRect: rect(heroTitle),
    heroTitleFontSize: titleStyles?.fontSize || null,
    heroTitleLineHeight: titleStyles?.lineHeight || null,
    heroTitleLines: titleLines,
    overlayVariant: overlayFx?.getAttribute('data-overlay-variant') || null,
    overlayClasses: overlayFx?.className || null,
    gradientClasses: gradient?.className || null,
    overlayCoveragePx: overlayCoveragePx != null ? Number(overlayCoveragePx.toFixed(1)) : null,
    overlayCoverageRatio: heroRect && overlayCoveragePx != null ? Number((overlayCoveragePx / heroRect.height).toFixed(3)) : null,
    heroImageObjectPosition: heroImg?.style.objectPosition || imgStyles?.objectPosition || null,
    heroImageObjectFit: imgStyles?.objectFit || null,
    closeButtonRect: rect(closeButton),
    scrollPanelRect: rect(scrollPanel),
    scrollPanelOverflowY: scrollStyles?.overflowY || null,
    scrollPanelScrollHeight: scrollPanel?.scrollHeight ?? null,
    scrollPanelClientHeight: scrollPanel?.clientHeight ?? null,
    bodyOverflow: getComputedStyle(document.body).overflow,
    bodyInlineOverflow: document.body.style.overflow,
    tabLabels: Array.from(dialog.querySelectorAll('button')).map((b) => b.innerText.trim()).filter(Boolean),
    activeElementLabel: document.activeElement?.getAttribute?.('aria-label') || document.activeElement?.innerText || null,
  };
})()
