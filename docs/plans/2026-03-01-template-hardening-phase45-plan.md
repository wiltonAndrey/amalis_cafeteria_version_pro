# Template Hardening And Phase 4.5 Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Leave the site stable as a reusable master template, with the navbar bug fixed and Phase 4.5 pushed to a real 100/100 closure target.

**Architecture:** Stabilize first, then optimize. Lock the navbar behavior with regression tests, then remove remaining above-the-fold work in Home and Menu that still causes mobile render delay. Keep content concerns isolated from structure so future copy/SEO edits do not require code changes.

**Tech Stack:** React 19, Vite, Vitest, Lighthouse, Tailwind, React Router

---

### Task 1: Stabilize The Navbar Contract

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/test/components.test.tsx`

**Step 1: Keep a failing regression test for breakpoint parity**

Assert the hamburger trigger and drawer use the same desktop breakpoint.

**Step 2: Run the focused test**

Run: `npm run test:run -- src/test/components.test.tsx -t "uses the same desktop breakpoint for hamburger trigger and drawer"`

**Step 3: Keep the minimal implementation**

Use `lg:hidden` on both the trigger and the drawer.

**Step 4: Re-run the focused test**

Expected: PASS

### Task 2: Reconcile Current Code With Existing Performance Guards

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/ui/ProductCard.tsx`
- Modify: `src/pages/Menu.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/test/mobile_performance_critical_path.test.ts`

**Step 1: Run the existing critical-path tests**

Run: `npm run test:run -- src/test/mobile_performance_critical_path.test.ts`

**Step 2: Restore conformance with the intended shell**

- Remove above-the-fold heavy text effects from `Hero`
- Stop pulling menu cards through the monolithic `../../constants` import
- Remove or defer `framer-motion` cost from the initial `/carta` shell
- Use the existing deferred-hydration strategy where it meaningfully cuts mobile render delay

**Step 3: Re-run the critical-path tests**

Expected: PASS

### Task 3: Verify Template-Grade Stability

**Files:**
- Modify only if a failing test or build demands it

**Step 1: Run targeted UI suites**

Run: `npm run test:run -- src/test/components.test.tsx src/test/landing_refinement.test.tsx src/test/mobile_performance_critical_path.test.ts`

**Step 2: Run build**

Run: `npm run build`

**Step 3: Run React Doctor**

Run: `npx -y react-doctor@latest . --verbose`

### Task 4: Revalidate Phase 4.5

**Files:**
- Modify only if Lighthouse evidence shows a specific remaining bottleneck

**Step 1: Run a fresh Lighthouse pass on `/` and `/carta`**

Use the local canonical preview or the current Lighthouse scripts, with mobile and desktop.

**Step 2: If still below 100 mobile, fix only the measured bottleneck**

Target render-delay in above-the-fold content, not speculative optimizations.

**Step 3: Save evidence and update the F4.5 notes**

Record the exact result and remaining constraint, if any.
