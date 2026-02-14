import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Menu from '../pages/Menu'

const originalFetch = global.fetch

const mockResponse = (ok: boolean, payload: any): Response =>
({
  ok,
  json: async () => payload,
} as Response)

describe('Menu Integration', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    Element.prototype.setPointerCapture = vi.fn()
    Element.prototype.releasePointerCapture = vi.fn()
    global.fetch = vi.fn().mockRejectedValue(new Error('offline'))
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('usa productos de API cuando estan disponibles', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      mockResponse(true, {
        menuCategories: [
          { id: 'all', label: 'Todos' },
          { id: 'cocas', label: 'Cocas' },
        ],
        menuProducts: [
          {
            id: '901',
            name: 'Producto API',
            price: 4.2,
            category: 'cocas',
            description: 'Desde API',
            image: '/images/sections/pan-artesano-horneado.webp',
            ingredients: ['Harina'],
            allergens: ['Gluten'],
            featured: false,
          },
        ],
      })
    )

    render(<MemoryRouter><Menu /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText('Producto API')).toBeInTheDocument()
    })
  })

  it('hace fallback a constantes si la API falla', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText('Coca de Mollitas')).toBeInTheDocument()
    })
  })

  it('filtra productos por categoria', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    const cocasButton = screen.getByText('Cocas').closest('button')
    if (cocasButton) {
      await act(async () => {
        fireEvent.pointerDown(cocasButton, { pageX: 100, pointerId: 1 })
        fireEvent.pointerUp(cocasButton, { pageX: 100, pointerId: 1 })
        await new Promise(r => setTimeout(r, 200))
      })
    }

    expect(screen.getByText('Coca de Mollitas')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Croissant de Mantequilla')).not.toBeInTheDocument()
    })
  })

  it('abre modal de producto al hacer click', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    const productElement = screen.getByText('Coca de Mollitas')
    await act(async () => {
      fireEvent.click(productElement)
      await new Promise(r => setTimeout(r, 50))
    })

    expect(screen.getByText('Ingredientes')).toBeInTheDocument()
  })

  it('cierra modal con Escape', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    fireEvent.click(screen.getByText('Coca de Mollitas'))
    expect(screen.getByText('Ingredientes')).toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
      await new Promise(r => setTimeout(r, 400))
    })

    expect(screen.queryByText('Ingredientes')).not.toBeInTheDocument()
  })
})
