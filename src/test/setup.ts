import '@testing-library/jest-dom'

// Mock IntersectionObserver for framer-motion
class MockIntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords(): IntersectionObserverEntry[] { return []; }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock ResizeObserver for framer-motion
class MockResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
