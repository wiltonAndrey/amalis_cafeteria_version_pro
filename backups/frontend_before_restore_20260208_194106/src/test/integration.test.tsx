import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Menu from '../pages/Menu'

describe('Menu Integration', () => {
    beforeEach(() => {
        Element.prototype.scrollIntoView = vi.fn()
        Element.prototype.setPointerCapture = vi.fn()
        Element.prototype.releasePointerCapture = vi.fn()
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    })

    it('renders all products by default', () => {
        render(<MemoryRouter><Menu /></MemoryRouter>)
        expect(screen.getByText('Coca de Mollitas')).toBeInTheDocument()
    })

    it('filters products by category', async () => {
        render(<MemoryRouter><Menu /></MemoryRouter>)
        const cocasButton = screen.getByText('Cocas').closest('button')
        if (cocasButton) {
            await act(async () => {
                fireEvent.pointerDown(cocasButton, { pageX: 100, pointerId: 1 })
                fireEvent.pointerUp(cocasButton, { pageX: 100, pointerId: 1 })
                await new Promise(r => setTimeout(r, 500))
            })
        }
        expect(screen.getByText('Coca de Mollitas')).toBeInTheDocument()
        expect(screen.queryByText('Croissant de Mantequilla')).not.toBeInTheDocument()
    })

    it('opens product modal on click', async () => {
        render(<MemoryRouter><Menu /></MemoryRouter>)
        const productElement = screen.getByText('Coca de Mollitas')
        fireEvent.click(productElement)
        expect(screen.getByText('Ingredientes')).toBeInTheDocument()
    })

    it('closes product modal', async () => {
        render(<MemoryRouter><Menu /></MemoryRouter>)
        const productElement = screen.getByText('Coca de Mollitas')
        fireEvent.click(productElement)

        // Wait for modal to be definitely there
        const closeButton = screen.getAllByLabelText(/cerrar modal/i)[0]
        await act(async () => {
            fireEvent.click(closeButton)
            await new Promise(r => setTimeout(r, 400))
        })
        expect(screen.queryByText('Ingredientes')).not.toBeInTheDocument()
    })

    it('closes product modal with Escape key', async () => {
        render(<MemoryRouter><Menu /></MemoryRouter>)
        const productElement = screen.getByText('Coca de Mollitas')
        fireEvent.click(productElement)
        expect(screen.getByText('Ingredientes')).toBeInTheDocument()

        await act(async () => {
            fireEvent.keyDown(document, { key: 'Escape' })
            await new Promise(r => setTimeout(r, 400))
        })
        expect(screen.queryByText('Ingredientes')).not.toBeInTheDocument()
    })
})
