import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import ProductModal from '../components/ProductModal'
import type { MenuProduct } from '../types'

const productFixture: MenuProduct = {
  id: 'modal-1',
  name: 'AlmojÃ¡bena',
  price: 1.05,
  category: 'pasteleria',
  description: 'Un dulce clÃ¡sico para acompaÃ±ar tu cafÃ©.',
  image: '/images/products/Almojabena.webp',
  alt_text: 'AlmojÃ¡bena con cafÃ© sobre tabla de madera',
  image_title: 'AlmojÃ¡bena artesanal',
  chef_suggestion: 'PÃ­dela templada.',
  ingredients: ['Harina'],
  allergens: ['Gluten'],
  featured: false,
}

const longTitleProductFixture: MenuProduct = {
  ...productFixture,
  id: 'modal-2',
  name: 'Bizcocho de Pepitas de Chocolate',
}

describe('ProductModal', () => {
  it('no renderiza contenido cuando no hay producto', () => {
    const { container } = render(<ProductModal product={null} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza la estructura visual del hero de imagen con overlay controlado', () => {
    render(<ProductModal product={productFixture} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: /almoj/i })
    expect(dialog).toBeInTheDocument()

    const imageShell = within(dialog).getByTestId('product-modal-image-shell')
    const heroImage = within(imageShell).getByTestId('product-modal-hero-image')
    const imageOverlay = within(imageShell).getByTestId('product-modal-image-overlay')

    expect(heroImage).toHaveAttribute('alt', 'AlmojÃ¡bena con cafÃ© sobre tabla de madera')
    expect(heroImage).toHaveAttribute('title', 'AlmojÃ¡bena artesanal')
    expect(imageOverlay).toHaveAttribute('data-overlay-variant', 'modal-image')
  })

  it('usa una variante mobile-first con hero mas limpio y header debajo de la imagen', () => {
    render(<ProductModal product={longTitleProductFixture} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: /pepitas de chocolate/i })
    const imageShell = within(dialog).getByTestId('product-modal-image-shell')

    expect(imageShell).toHaveClass('aspect-[4/3]')
    expect(within(imageShell).queryByRole('heading', { name: /pepitas de chocolate/i })).not.toBeInTheDocument()

    const mobileHeader = within(dialog).getByTestId('product-modal-mobile-header')
    expect(mobileHeader).toHaveAttribute('data-mobile-hero-layout', 'below-image')
    expect(within(mobileHeader).getByText('Pastelería')).toBeInTheDocument()
    expect(within(mobileHeader).getByRole('heading', { name: /pepitas de chocolate/i })).toBeInTheDocument()

    const contentPanel = within(dialog).getByTestId('product-modal-content-panel')
    const scrollPanel = within(dialog).getByTestId('product-modal-scroll-panel')
    expect(contentPanel).toHaveClass('min-h-0')
    expect(scrollPanel).toHaveClass('min-h-0')
  })

  it('monta el modal en portal y en una capa superior al navbar fijo', () => {
    render(<ProductModal product={productFixture} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: /almoj/i })
    const modalViewportLayer = dialog.parentElement

    expect(modalViewportLayer).toBeInTheDocument()
    expect(modalViewportLayer).toHaveClass('fixed', 'inset-0')
    expect(modalViewportLayer).toHaveClass('z-[80]')
    expect(modalViewportLayer?.parentElement).toBe(document.body)
  })

  it('mantiene tabs funcionales sin romper el contenido del modal', async () => {
    render(<ProductModal product={productFixture} onClose={vi.fn()} />)

    expect(screen.getByText(productFixture.description)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /ingredientes/i }))
    await waitFor(() => {
      expect(screen.getByText('Harina')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Alérgenos'))
    await waitFor(() => {
      expect(screen.getByText('Gluten')).toBeInTheDocument()
    })
  })

  it('bloquea y restaura el scroll del body al abrir y cerrar el modal', () => {
    const { rerender } = render(<ProductModal product={productFixture} onClose={vi.fn()} />)

    expect(document.body.style.overflow).toBe('hidden')

    rerender(<ProductModal product={null} onClose={vi.fn()} />)
    expect(document.body.style.overflow).toBe('')
  })
})
