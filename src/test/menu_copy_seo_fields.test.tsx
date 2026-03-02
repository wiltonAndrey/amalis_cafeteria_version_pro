import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '../components/ui/ProductCard'
import { ProductModalTabs } from '../components/ProductModalTabs'
import type { MenuProduct } from '../types'

const menuProductBase: MenuProduct = {
  id: 'm-1',
  name: 'Coca de Verdura',
  price: 2.3,
  category: 'bolleria_salada',
  description: 'Texto de prueba',
  image: '/images/products/Coca-Pisto.webp',
  ingredients: ['Harina'],
  allergens: ['Gluten'],
  featured: false,
}

describe('Menu copy SEO fields', () => {
  it('uses alt_text and image_title in ProductCard for menu items', () => {
    render(
      <ProductCard
        product={{
          ...menuProductBase,
          alt_text: 'Alt SEO de prueba',
          image_title: 'Title SEO de prueba',
        }}
      />
    )

    const image = screen.getByAltText('Alt SEO de prueba')
    expect(image).toHaveAttribute('title', 'Title SEO de prueba')
  })

  it('shows chef suggestion from the product data in modal tabs', () => {
    render(
      <ProductModalTabs
        product={{
          ...menuProductBase,
          chef_suggestion: 'Pídela templada para notar mejor la masa.',
        } as MenuProduct}
        activeTab="desc"
        onTabChange={() => {}}
      />
    )

    expect(screen.getByText('Pídela templada para notar mejor la masa.')).toBeInTheDocument()
  })
})
