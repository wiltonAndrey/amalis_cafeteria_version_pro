import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useMenuProducts', () => ({
  useMenuProducts: () => ({
    menuCategories: [{ id: 'all', label: 'Todos' }],
    menuProducts: [],
    loading: false,
    error: null,
  }),
}));

import Menu from '../pages/Menu';

describe('Menu responsive layout', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('usa un shell de 100dvh con scroll interno para pantallas bajas', () => {
    render(<Menu />);

    const shell = screen.getByTestId('menu-shell');
    const headerSpacer = screen.getByTestId('menu-header-spacer');
    const scrollBody = screen.getByTestId('menu-scroll-body');

    expect(shell).toHaveClass('h-[100dvh]');
    expect(shell).toHaveClass('flex');
    expect(shell).toHaveClass('flex-col');
    expect(shell).toHaveClass('overflow-hidden');

    expect(headerSpacer).toHaveClass('shrink-0');

    expect(scrollBody).toHaveClass('flex-1');
    expect(scrollBody).toHaveClass('min-h-0');
    expect(scrollBody).toHaveClass('overflow-y-auto');
    expect(scrollBody).toHaveClass('overflow-x-hidden');
    expect(scrollBody).toHaveClass('pb-16');
    expect(scrollBody).toHaveClass('no-scrollbar');
  });
});
