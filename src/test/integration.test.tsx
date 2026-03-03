import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Menu from '../pages/Menu'

const originalFetch = global.fetch

const expectElementToAppearBefore = (firstNode: HTMLElement, secondNode: HTMLElement) => {
  const position = firstNode.compareDocumentPosition(secondNode)

  expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
}

const getCategoryButton = (categoryId: string) =>
  document.querySelector(`[data-category="${categoryId}"]`) as HTMLElement | null

const getGroupHeading = (categoryId: string) =>
  document.getElementById(`menu-group-${categoryId}`) as HTMLElement | null

const mockResponse = (ok: boolean, payload: any): Response =>
({
  ok,
  json: async () => payload,
} as Response)

const defaultMenuPayload = {
  menuProducts: [
    {
      id: '6',
      name: 'Tostada de Tomate y AOVE',
      price: 2.8,
      category: 'tostadas',
      sort_order: 1,
      description: 'Tostada',
      image: '/images/products/Tostada-Tomate.webp',
      ingredients: ['Pan'],
      allergens: ['Gluten'],
      featured: false,
    },
    {
      id: '1',
      name: 'Coca de Mollitas',
      price: 1.5,
      category: 'bolleria-salada',
      sort_order: 1,
      description: 'Salado',
      image: '/images/products/Coca-Sardina.webp',
      ingredients: ['Harina'],
      allergens: ['Gluten'],
      featured: true,
    },
    {
      id: '4',
      name: 'Croissant de Mantequilla',
      price: 1.4,
      category: 'bolleria-dulce',
      sort_order: 1,
      description: 'Dulce',
      image: '/images/products/Croissant-Mantequilla.webp',
      ingredients: ['Harina'],
      allergens: ['Gluten'],
      featured: false,
    },
    {
      id: '5',
      name: 'Bizcocho de Yogur y Limón',
      price: 12,
      category: 'pasteleria',
      sort_order: 1,
      description: 'Pasteleria',
      image: '/images/products/Bizcocho.webp',
      ingredients: ['Huevo'],
      allergens: ['Gluten'],
      featured: false,
    },
    {
      id: '7',
      name: 'Pack Desayuno Amalis',
      price: 4.5,
      category: 'ofertas',
      sort_order: 1,
      description: 'Oferta',
      image: '/images/sections/editada-04.webp',
      ingredients: ['Varios'],
      allergens: ['Varios'],
      featured: true,
    },
    {
      id: 'b3',
      name: 'Capuchino',
      price: 1.8,
      category: 'bebidas',
      sort_order: 1,
      description: 'Cafe',
      image: '/images/sections/latte-art-cafe-especialidad.webp',
      ingredients: ['Cafe'],
      allergens: ['Lacteos'],
      featured: false,
    },
  ],
};

describe('Menu Integration', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    Element.prototype.setPointerCapture = vi.fn()
    Element.prototype.releasePointerCapture = vi.fn()
    global.fetch = vi.fn().mockResolvedValue(mockResponse(true, defaultMenuPayload))
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

  it('muestra estado vacio si la API falla sin inyectar productos hardcodeados', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('offline'))

    render(<MemoryRouter><Menu /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText(/Estamos preparando nuevas delicias/i)).toBeInTheDocument()
    })

    expect(screen.queryByText('Coca de Mollitas')).not.toBeInTheDocument()
  })

  it('ordena la vista Todos por bloques de categoria siguiendo el menu visual', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText('Tostada de Tomate y AOVE')).toBeInTheDocument()
    })

    const tostadasGroup = getGroupHeading('tostadas')
    const saladoGroup = getGroupHeading('bolleria-salada')
    const dulceGroup = getGroupHeading('bolleria-dulce')
    const pasteleriaGroup = getGroupHeading('pasteleria')
    const ofertasGroup = getGroupHeading('ofertas')
    const bebidasGroup = getGroupHeading('bebidas')

    expect(tostadasGroup).toBeTruthy()
    expect(saladoGroup).toBeTruthy()
    expect(dulceGroup).toBeTruthy()
    expect(pasteleriaGroup).toBeTruthy()
    expect(ofertasGroup).toBeTruthy()
    expect(bebidasGroup).toBeTruthy()

    expectElementToAppearBefore(tostadasGroup!, saladoGroup!)
    expectElementToAppearBefore(saladoGroup!, dulceGroup!)
    expectElementToAppearBefore(dulceGroup!, pasteleriaGroup!)
    expectElementToAppearBefore(pasteleriaGroup!, ofertasGroup!)
    expectElementToAppearBefore(ofertasGroup!, bebidasGroup!)

    expectElementToAppearBefore(
      screen.getByText('Tostada de Tomate y AOVE'),
      screen.getByText('Coca de Mollitas')
    )
    expectElementToAppearBefore(
      screen.getByText('Pack Desayuno Amalis'),
      screen.getByText('Capuchino')
    )
  })

  it('filtra productos por categoria', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    const saladoButton = getCategoryButton('bolleria-salada')
    if (saladoButton) {
      await act(async () => {
        fireEvent.pointerDown(saladoButton, { pageX: 100, pointerId: 1 })
        fireEvent.pointerUp(saladoButton, { pageX: 100, pointerId: 1 })
        await new Promise(r => setTimeout(r, 200))
      })
    }

    expect(screen.getByText('Coca de Mollitas')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Croissant de Mantequilla')).not.toBeInTheDocument()
    })
  })

  it('filtra bebidas por categoria', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    const bebidasButton = getCategoryButton('bebidas')
    if (bebidasButton) {
      await act(async () => {
        fireEvent.pointerDown(bebidasButton, { pageX: 100, pointerId: 1 })
        fireEvent.pointerUp(bebidasButton, { pageX: 100, pointerId: 1 })
        await new Promise(r => setTimeout(r, 200))
      })
    }

    expect(screen.getByText('Capuchino')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Coca de Mollitas')).not.toBeInTheDocument()
    })
  })

  it('corrige el orden de la API en Todos y mantiene el filtro por categoria cuando falta sort_order', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      mockResponse(true, {
        menuProducts: [
          {
            id: 'cms-sweet-z',
            name: 'Zeta Dulce',
            price: 2.5,
            category: 'bolleria',
            description: 'Dulce Z',
            image: '/images/test/zeta.webp',
            ingredients: [],
            allergens: [],
          },
          {
            id: 'cms-sweet-a',
            name: 'Alfa Dulce',
            price: 2.3,
            category: 'bolleria',
            description: 'Dulce A',
            image: '/images/test/alfa.webp',
            ingredients: [],
            allergens: [],
          },
        ],
      })
    )

    render(<MemoryRouter><Menu /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText('Zeta Dulce')).toBeInTheDocument()
    })

    expectElementToAppearBefore(
      screen.getByText('Alfa Dulce'),
      screen.getByText('Zeta Dulce')
    )

    const dulceButton = getCategoryButton('bolleria-dulce')
    if (dulceButton) {
      await act(async () => {
        fireEvent.pointerDown(dulceButton, { pageX: 100, pointerId: 1 })
        fireEvent.pointerUp(dulceButton, { pageX: 100, pointerId: 1 })
        await new Promise(r => setTimeout(r, 200))
      })
    }

    expect(screen.getByText('Alfa Dulce')).toBeInTheDocument()
    expect(screen.getByText('Zeta Dulce')).toBeInTheDocument()
    expectElementToAppearBefore(
      screen.getByText('Alfa Dulce'),
      screen.getByText('Zeta Dulce')
    )

    await waitFor(() => {
      expect(screen.queryByText('Coca de Mollitas')).not.toBeInTheDocument()
    })
  })

  it('abre modal de producto al hacer click', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    const productElement = await screen.findByText('Coca de Mollitas')
    await act(async () => {
      fireEvent.click(productElement)
      await new Promise(r => setTimeout(r, 50))
    })

    expect(screen.getByText('Ingredientes')).toBeInTheDocument()
  })

  it('cierra modal con Escape', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>)

    fireEvent.click(await screen.findByText('Coca de Mollitas'))
    expect(screen.getByText('Ingredientes')).toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
      await new Promise(r => setTimeout(r, 400))
    })

    expect(screen.queryByText('Ingredientes')).not.toBeInTheDocument()
  })
})
