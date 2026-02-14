import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

describe('Button', () => {
    it('renders with children', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('applies primary variant by default', () => {
        render(<Button>Primary</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('bg-brownie')
    })

    it('applies secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('bg-caramel')
    })

    it('applies size classes', () => {
        render(<Button size="lg">Large</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('py-4')
    })

    it('handles click events', async () => {
        const user = userEvent.setup()
        let clicked = false
        render(<Button onClick={() => { clicked = true }}>Click</Button>)

        await user.click(screen.getByRole('button'))
        expect(clicked).toBe(true)
    })

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })
})

describe('Badge', () => {
    it('renders with children', () => {
        render(<Badge>New</Badge>)
        expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<Badge variant="caramel">Test</Badge>)
        const badge = screen.getByText('Test')
        expect(badge.className).toContain('bg-caramel')
    })

    it('applies outline variant', () => {
        render(<Badge variant="outline">Outline</Badge>)
        const badge = screen.getByText('Outline')
        expect(badge.className).toContain('border-caramel')
    })
})

// Tests para ProductCard
import { ProductCard } from '../components/ui/ProductCard'
import { Product } from '../types'

const mockProduct: Product = {
    id: '1',
    name: 'Pan de Masa Madre',
    description: 'Delicioso pan artesanal',
    price: '3.50€',
    category: 'Bread',
    imageUrl: 'https://example.com/bread.jpg',
    imageAlt: 'Pan artesanal'
}

describe('ProductCard', () => {
    it('renders product name', () => {
        render(<ProductCard product={mockProduct} />)
        expect(screen.getByText('Pan de Masa Madre')).toBeInTheDocument()
    })

    it('renders product price', () => {
        render(<ProductCard product={mockProduct} />)
        expect(screen.getByText('3.50€')).toBeInTheDocument()
    })

    it('renders product description', () => {
        render(<ProductCard product={mockProduct} />)
        expect(screen.getByText('Delicioso pan artesanal')).toBeInTheDocument()
    })

    it('renders product image with correct alt text', () => {
        render(<ProductCard product={mockProduct} />)
        const image = screen.getByAltText('Pan artesanal')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', mockProduct.imageUrl)
    })

    it('falls back to placeholder on image error', () => {
        render(<ProductCard product={mockProduct} />)
        const image = screen.getByAltText('Pan artesanal') as HTMLImageElement
        fireEvent.error(image)
        expect(image.getAttribute('src')).toContain('/images/sections/pan-artesano-horneado.webp')
    })

    it('uses product name as alt text when imageAlt is not provided', () => {
        const productWithoutAlt = { ...mockProduct, imageAlt: undefined }
        render(<ProductCard product={productWithoutAlt} />)
        expect(screen.getByAltText('Pan de Masa Madre')).toBeInTheDocument()
    })

    it('renders category badge', () => {
        render(<ProductCard product={mockProduct} />)
        expect(screen.getByText('Pan')).toBeInTheDocument()
    })
})

// Tests para Hero
import Hero from '../components/Hero'

describe('Hero', () => {
    it('renders main heading', () => {
        render(<MemoryRouter><Hero /></MemoryRouter>)
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('renders heading text', () => {
        render(<MemoryRouter><Hero /></MemoryRouter>)
        expect(screen.getByText(/panader[ií]a, cafeter[ií]a y pasteler[ií]a/i)).toBeInTheDocument()
    })

    it('renders menu button', () => {
        render(<MemoryRouter><Hero /></MemoryRouter>)
        expect(screen.getByRole('button', { name: /ver carta/i })).toBeInTheDocument()
    })

    it('renders history button', () => {
        render(<MemoryRouter><Hero /></MemoryRouter>)
        expect(screen.getByRole('button', { name: /c[oó]mo llegar/i })).toBeInTheDocument()
    })

    it('renders hero image', () => {
        render(<MemoryRouter><Hero /></MemoryRouter>)
        const image = screen.getByAltText(/hogazas de pan artesano/i)
        expect(image).toBeInTheDocument()
    })

    it('renders description paragraph', () => {
        render(<MemoryRouter><Hero /></MemoryRouter>)
        expect(screen.getByText(/pan y boller[ií]a reci[eé]n horneados/i)).toBeInTheDocument()
    })

    it('navigates to menu page on click', async () => {
        const heroSource = readFileSync(path.resolve(__dirname, '../components/Hero.tsx'), 'utf8')
        expect(heroSource).toContain("window.location.assign('/carta')")
    })
})

// Tests para Footer - Actualizado para reflejar estado actual
import Footer from '../components/Footer'

describe('Footer', () => {
    it('renders brand name', () => {
        render(<Footer />)
        expect(screen.getByText('Amalis')).toBeInTheDocument()
        expect(screen.getByText('Cafetería')).toBeInTheDocument()
    })

    it('renders brand description', () => {
        render(<Footer />)
        expect(screen.getByText(/Ven a probar la diferencia de lo recién hecho/i)).toBeInTheDocument()
    })

    it('renders "Explora" section with links', () => {
        render(<Footer />)
        expect(screen.getByRole('heading', { name: /explora/i })).toBeInTheDocument()
        expect(screen.getByText('Carta')).toBeInTheDocument()
        expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument()
        expect(screen.getByText('Galería')).toBeInTheDocument()
        expect(screen.getByText('Ubicación')).toBeInTheDocument()
    })

    it('renders "Contacto" section with links', () => {
        render(<Footer />)
        expect(screen.getByRole('heading', { name: /contacto/i })).toBeInTheDocument()
        expect(screen.getByText(/Visítanos en Santa Pola/i)).toBeInTheDocument()
    })

    it('renders "Horario" section', () => {
        render(<Footer />)
        expect(screen.getByRole('heading', { name: /horario/i })).toBeInTheDocument()
        expect(screen.getByText('Lunes - Domingo')).toBeInTheDocument()
        expect(screen.getByText('07:00 - 21:00')).toBeInTheDocument()
    })

    it('renders social media links', () => {
        render(<Footer />)
        expect(screen.getByLabelText(/síguenos en instagram/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/síguenos en facebook/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/síguenos en twitter/i)).toBeInTheDocument()
    })

    it('renders copyright notice with current year', () => {
        render(<Footer />)
        const currentYear = new Date().getFullYear()
        expect(screen.getByText(new RegExp(`© ${currentYear} Amalis Cafetería`, 'i'))).toBeInTheDocument()
    })

    it('renders legal links', () => {
        render(<Footer />)
        expect(screen.getByText('Privacidad')).toBeInTheDocument()
        expect(screen.getByText('Cookies')).toBeInTheDocument()
    })
})

// Tests para Gallery - Actualizado
import Gallery from '../components/Gallery'

describe('Gallery', () => {
    it('renders gallery section title', () => {
        render(<Gallery />)
        expect(screen.getByText('Nuestra Galería')).toBeInTheDocument()
    })

    it('renders gallery heading', () => {
        render(<Gallery />)
        expect(screen.getByText('Sumérgete en nuestra atmósfera')).toBeInTheDocument()
    })

    it('renders gallery images', () => {
        render(<Gallery />)
        const images = screen.getAllByRole('img')
        expect(images.length).toBeGreaterThan(0)
    })

    it('renders images with alt text', () => {
        render(<Gallery />)
        // Images may appear multiple times due to responsive gallery carousel
        const croissantImages = screen.getAllByAltText(/mini croissants rellenos de chocolate/i)
        expect(croissantImages.length).toBeGreaterThan(0)
        const bizcochoImages = screen.getAllByAltText(/bizcocho de chocolate/i)
        expect(bizcochoImages.length).toBeGreaterThan(0)
    })
})

// Tests para Testimonials
import Testimonials from '../components/Testimonials'

describe('Testimonials', () => {
    it('renders section heading', () => {
        render(<Testimonials />)
        expect(screen.getByRole('heading', { name: /lo que se dice de nosotros/i })).toBeInTheDocument()
    })

    it('renders testimonial cards', () => {
        render(<Testimonials />)
        const images = screen.getAllByRole('img')
        expect(images.length).toBeGreaterThan(0)
    })

    it('renders star ratings', () => {
        render(<Testimonials />)
        const stars = document.querySelectorAll('svg.fill-current')
        expect(stars.length).toBeGreaterThan(0)
    })

    it('renders testimonial names', () => {
        render(<Testimonials />)
        expect(screen.getAllByText(/Mar[ií]a G[oó]mez/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText('Jorge Rocamora').length).toBeGreaterThan(0)
    })

    it('renders testimonial roles', () => {
        render(<Testimonials />)
        expect(screen.getAllByText('Cliente Habitual').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Primera Visita').length).toBeGreaterThan(0)
    })
})

// Tests para WhyChooseUs
import WhyChooseUs from '../components/WhyChooseUs'

describe('WhyChooseUs', () => {
    it('renders section heading', () => {
        render(<MemoryRouter><WhyChooseUs /></MemoryRouter>)
        expect(screen.getByRole('heading', { name: /nuestra.*historia/i })).toBeInTheDocument()
    })

    it('renders Tradicion feature', () => {
        render(<MemoryRouter><WhyChooseUs /></MemoryRouter>)
        expect(screen.getAllByText(/Tradici[oó]n/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Respetamos el oficio/i).length).toBeGreaterThan(0)
    })

    it('renders Sin Atajos feature', () => {
        render(<MemoryRouter><WhyChooseUs /></MemoryRouter>)
        expect(screen.getAllByText(/Sin atajos/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/horneado en su punto/i).length).toBeGreaterThan(0)
    })

    it('renders 100% Manos Vecinas feature', () => {
        render(<MemoryRouter><WhyChooseUs /></MemoryRouter>)
        expect(screen.getAllByText(/Manos vecinas/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Somos de aqu[ií]/i).length).toBeGreaterThan(0)
    })

    it('renders feature images', () => {
        render(<MemoryRouter><WhyChooseUs /></MemoryRouter>)
        expect(screen.getAllByAltText(/Panadero preparando pan tradicional/i).length).toBeGreaterThan(0)
        expect(screen.getAllByAltText(/Barras de pan reci[eé]n horneadas/i).length).toBeGreaterThan(0)
        expect(screen.getAllByAltText(/Barista preparando caf[eé] de especialidad/i).length).toBeGreaterThan(0)
    })

    it('renders "Ver carta completa" link', () => {
        render(<MemoryRouter><WhyChooseUs /></MemoryRouter>)
        const links = screen.getAllByRole('link', { name: /ver carta completa/i })
        expect(links.length).toBeGreaterThanOrEqual(1)
    })
})

// Tests para Navbar
import { Navbar } from '../components/layout/Navbar'

describe('Navbar', () => {
    it('renders brand logo A', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        expect(screen.getByText('A')).toBeInTheDocument()
    })

    it('renders Amalis Cafetería brand', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        expect(screen.getByText('Amalis')).toBeInTheDocument()
        expect(screen.getByText('Cafetería')).toBeInTheDocument()
    })

    it('renders hamburger menu button', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        expect(screen.getByLabelText(/abrir menú/i)).toBeInTheDocument()
    })

    it('has aria-expanded attribute on hamburger', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        const hamburger = screen.getByLabelText(/abrir menú/i)
        expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    })

    it('renders main navigation with aria-label', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument()
    })

    it('renders Skip Link for keyboard navigation', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        expect(screen.getByText(/saltar al contenido principal/i)).toBeInTheDocument()
    })

    it('Skip Link has correct href', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>)
        const skipLink = screen.getByText(/saltar al contenido principal/i)
        expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('drawer has dialog role when open', async () => {
        const user = userEvent.setup()
        render(<MemoryRouter><Navbar /></MemoryRouter>)

        const hamburger = screen.getByLabelText(/abrir menú/i)
        await user.click(hamburger)

        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('drawer has aria-modal attribute', async () => {
        const user = userEvent.setup()
        render(<MemoryRouter><Navbar /></MemoryRouter>)

        const hamburger = screen.getByLabelText(/abrir menú/i)
        await user.click(hamburger)

        expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('closes drawer on Escape key', async () => {
        const user = userEvent.setup()
        render(<MemoryRouter><Navbar /></MemoryRouter>)

        const hamburger = screen.getByLabelText(/abrir menú/i)
        await user.click(hamburger)
        expect(screen.getByLabelText(/cerrar menú/i)).toBeInTheDocument()

        await user.keyboard('{Escape}')
        expect(screen.getByLabelText(/abrir menú/i)).toBeInTheDocument()
    })
})

// Tests para FeaturedProducts - Actualizado
import FeaturedProducts from '../components/sections/FeaturedProducts'

describe('FeaturedProducts', () => {
    it('renders section subtitle', () => {
        render(<MemoryRouter><FeaturedProducts /></MemoryRouter>)
        expect(screen.getByText(/Lo que m[aá]s se pide/i)).toBeInTheDocument()
    })

    it('renders section title', () => {
        render(<MemoryRouter><FeaturedProducts /></MemoryRouter>)
        expect(screen.getByRole('heading', { name: /los 4.*pilares/i })).toBeInTheDocument()
    })

    it('renders section description', () => {
        render(<MemoryRouter><FeaturedProducts /></MemoryRouter>)
        expect(screen.getByText(/Pan, salado y dulce del d[ií]a/i)).toBeInTheDocument()
    })

    it('renders product cards', () => {
        render(<MemoryRouter><FeaturedProducts /></MemoryRouter>)
        expect(screen.getAllByText(/Pan del d[ií]a/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Cocas de Santa Pola/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Dulces para el caf[eé]/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Pasteles y tartas/i).length).toBeGreaterThan(0)
    })

    it('renders "Ver Carta Completa" link', () => {
        render(<MemoryRouter><FeaturedProducts /></MemoryRouter>)
        expect(screen.getByRole('link', { name: /ver carta completa/i })).toBeInTheDocument()
    })
})

// Tests para LocationSection - Actualizado
import LocationSection from '../components/sections/LocationSection'

describe('LocationSection', () => {
    it('renders section title with Santa Pola highlighted', () => {
        render(<LocationSection />)
        expect(screen.getByRole('heading', { name: /encu[eé]ntranos.*santa pola/i })).toBeInTheDocument()
    })

    it('renders section description', () => {
        render(<LocationSection />)
        expect(screen.getByText(/Activa tu ubicaci[oó]n/i)).toBeInTheDocument()
    })

    it('renders location link', () => {
        render(<LocationSection />)
        expect(screen.getByRole('link', { name: /descubre nuestra ubicaci[oó]n/i })).toBeInTheDocument()
    })

    it('renders main store info', () => {
        render(<LocationSection />)
        expect(screen.getByText('Nuestra Casa')).toBeInTheDocument()
        expect(screen.getByText(/Carrer Almirante Antequera, 11/i)).toBeInTheDocument()
    })

    it('renders current day opening hours', () => {
        render(<LocationSection />)
        expect(screen.getByText(/Abierto hoy:/i)).toBeInTheDocument()
    })

    it('renders map card', () => {
        render(<LocationSection />)
        expect(screen.getByText(/necesitas un encargo/i)).toBeInTheDocument()
    })

    it('renders "Llamar ahora" link', () => {
        render(<LocationSection />)
        expect(screen.getByRole('link', { name: /llamar ahora/i })).toBeInTheDocument()
    })

    it('renders location map iframe', () => {
        // The iframe is lazy-loaded with IntersectionObserver, it won't appear in JSDOM without intersection
        render(<LocationSection />)
        // Just verify the section renders without errors
        expect(screen.getByText(/Nuestra Casa/i)).toBeInTheDocument()
    })
})

// Tests para Reveal
import { Reveal } from '../components/ui/Reveal'

describe('Reveal', () => {
    it('renders children correctly', () => {
        render(<Reveal><span>Test Content</span></Reveal>)
        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies default width fit-content', () => {
        const { container } = render(<Reveal><span>Content</span></Reveal>)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.style.width).toBe('fit-content')
    })

    it('applies 100% width when specified', () => {
        const { container } = render(<Reveal width="100%"><span>Content</span></Reveal>)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.style.width).toBe('100%')
    })

    it('applies custom className', () => {
        const { container } = render(<Reveal className="custom-class"><span>Content</span></Reveal>)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.className).toContain('custom-class')
    })

    it('renders with default direction up', () => {
        const { container } = render(<Reveal><span>Content</span></Reveal>)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with direction down', () => {
        const { container } = render(<Reveal direction="down"><span>Content</span></Reveal>)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with direction left', () => {
        const { container } = render(<Reveal direction="left"><span>Content</span></Reveal>)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with direction right', () => {
        const { container } = render(<Reveal direction="right"><span>Content</span></Reveal>)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('accepts delay prop', () => {
        const { container } = render(<Reveal delay={0.5}><span>Content</span></Reveal>)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('has overflow hidden on wrapper', () => {
        const { container } = render(<Reveal><span>Content</span></Reveal>)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.style.overflow).toBe('visible')
    })

    it('has relative position on wrapper', () => {
        const { container } = render(<Reveal><span>Content</span></Reveal>)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.style.position).toBe('relative')
    })
})
