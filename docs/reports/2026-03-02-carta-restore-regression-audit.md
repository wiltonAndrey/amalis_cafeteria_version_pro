# Carta Restore Regression Audit

Date: 2026-03-02

## Objective

Restore the approved visual appearance of `/carta` while keeping only the optimizations that do not alter the design contract of the template.

## Visual Regressions Reverted

- Removed the loading placeholder shell from `src/pages/Menu.tsx` because it changed the approved card grid appearance.
- Restored the approved navbar branding typography (`font-accent`) instead of the forced inline system font override.
- Restored the lighter desktop nav link styling and removed the extra active-scale behavior from drawer links to match the approved interaction feel.

## Functional Fixes Kept

- Kept the navbar breakpoint fix with `lg:hidden` on both the hamburger trigger and the drawer.
- Locked the mobile drawer contract with tests that confirm the drawer opens and exposes the full 5-link navigation set.

## Invisible Optimizations Kept

- Kept the lazy-loaded `ProductModal` so modal code stays out of the first menu paint.
- Kept deferred loading for non-priority product images in `ProductCard`.
- Kept the menu hero critical-CSS hooks (`#menu-page` and `#menu-page-hero`) used by `index.html`.
- Kept the frame-delayed menu fetch (`requestAnimationFrame`) so data hydration still starts after the initial frame boundary.

## Stabilization Added

- Added a normalization layer in `src/utils/menu-taxonomy.ts` so backend category aliases are mapped to a fixed UI category structure.
- The menu shell now uses a stable canonical category order, preserving labels and icon expectations even if backend taxonomy changes.
- Critical menu products are available on first paint again so the page keeps its approved visual density before the async fetch resolves.

## Optimizations Explicitly Discarded

- Placeholder card shells in the menu grid.
- Navbar typography overrides introduced only for performance scoring.
- Test assertions that forced removal of motion/icon-driven menu visuals when those changes degraded the approved UI.
