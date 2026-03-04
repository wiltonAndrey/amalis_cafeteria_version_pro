import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import Testimonials from '../components/Testimonials';

const OriginalIntersectionObserver = global.IntersectionObserver;

class TestIntersectionObserver {
  static instances: TestIntersectionObserver[] = [];

  readonly root: Element | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly observed = new Set<Element>();
  readonly options: IntersectionObserverInit | undefined;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.options = options;
    TestIntersectionObserver.instances.push(this);
  }

  observe = (element: Element) => {
    this.observed.add(element);
  };

  unobserve = (element: Element) => {
    this.observed.delete(element);
  };

  disconnect = () => {
    this.observed.clear();
  };

  takeRecords = (): IntersectionObserverEntry[] => [];

  trigger = (target: Element, isIntersecting = true) => {
    this.callback(
      [
        {
          isIntersecting,
          target,
          intersectionRatio: isIntersecting ? 1 : 0,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver
    );
  };
}

describe('Testimonials animated stars', () => {
  beforeEach(() => {
    TestIntersectionObserver.instances = [];
    global.IntersectionObserver = TestIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = OriginalIntersectionObserver;
  });

  it('starts each star group paused and plays it when that testimonial enters the viewport', () => {
    const { container } = render(<Testimonials />);

    const starsGroup = container.querySelector('.stars-paused') as HTMLElement | null;
    expect(starsGroup).not.toBeNull();

    if (!starsGroup) {
      return;
    }

    expect(starsGroup.querySelectorAll('svg.star-animate')).toHaveLength(5);

    const starsObserver = TestIntersectionObserver.instances.find((instance) => instance.observed.has(starsGroup));
    expect(starsObserver).toBeDefined();
    expect(starsObserver?.options?.threshold).toBe(0.15);

    act(() => {
      starsObserver?.trigger(starsGroup, true);
    });

    expect(starsGroup).toHaveClass('stars-playing');
    expect(starsGroup).not.toHaveClass('stars-paused');
  });
});
