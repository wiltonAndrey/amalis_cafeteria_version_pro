import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import LocationSection from '../components/sections/LocationSection';

const INSTAGRAM_URL =
  'https://www.instagram.com/amalis_cafeteria?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
const MAPS_URL = 'https://maps.app.goo.gl/pjmdGPLnPDWcudXs6';

describe('Footer and contact final links', () => {
  it('uses the final instagram URL and keeps future social links hidden', () => {
    render(<Footer />);

    expect(screen.getByLabelText(/instagram/i)).toHaveAttribute('href', INSTAGRAM_URL);
    expect(screen.getByLabelText(/facebook/i)).toHaveClass('hidden');
    expect(screen.getByLabelText(/twitter/i)).toHaveClass('hidden');
  });

  it('keeps privacy and cookies hidden for now', () => {
    render(<Footer />);

    expect(screen.getByRole('button', { name: /privacidad/i })).toHaveClass('hidden');
    expect(screen.getByRole('button', { name: /cookies/i })).toHaveClass('hidden');
  });

  it('points the footer visit link to the final maps URL', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /vis[ií]tanos en santa pola/i })).toHaveAttribute('href', MAPS_URL);
  });

  it('points the location CTA to the final maps URL', () => {
    render(<LocationSection />);

    expect(screen.getByRole('link', { name: /descubre nuestra ubicaci[oó]n/i })).toHaveAttribute('href', MAPS_URL);
  });

  it('opens the hero map CTA with the final maps URL', async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /c[oó]mo llegar/i }));

    expect(openSpy).toHaveBeenCalledWith(MAPS_URL, '_blank', 'noopener,noreferrer');

    openSpy.mockRestore();
  });
});
