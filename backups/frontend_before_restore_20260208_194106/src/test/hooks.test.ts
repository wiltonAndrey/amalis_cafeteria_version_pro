import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMenu } from '../hooks/useMenu'
import { useScroll } from '../hooks/useScroll'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useCMS } from '../hooks/useCMS'

describe('useMenu', () => {
    it('should start closed', () => {
        const { result } = renderHook(() => useMenu())
        expect(result.current.isOpen).toBe(false)
    })

    it('should toggle open state', () => {
        const { result } = renderHook(() => useMenu())

        act(() => {
            result.current.toggle()
        })
        expect(result.current.isOpen).toBe(true)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.isOpen).toBe(false)
    })

    it('should close menu', () => {
        const { result } = renderHook(() => useMenu())

        act(() => {
            result.current.toggle()
        })
        expect(result.current.isOpen).toBe(true)

        act(() => {
            result.current.close()
        })
        expect(result.current.isOpen).toBe(false)
    })
})

describe('useScroll', () => {
    it('should start with isScrolled false', () => {
        const { result } = renderHook(() => useScroll())
        expect(result.current).toBe(false)
    })

    it('should accept custom threshold', () => {
        const { result } = renderHook(() => useScroll(100))
        expect(result.current).toBe(false)
    })
})

// Tests para useGeolocation
import { useGeolocation } from '../hooks/useGeolocation'

describe('useGeolocation', () => {
    const originalNavigator = global.navigator

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            writable: true
        })
        vi.useRealTimers()
    })

    it('should start with initial state', () => {
        const { result } = renderHook(() => useGeolocation())
        expect(result.current.loading).toBe(false)
        expect(result.current.locationFound).toBe(false)
        expect(result.current.coordinates).toBe(null)
        expect(result.current.error).toBe(null)
    })

    it('should have requestLocation function', () => {
        const { result } = renderHook(() => useGeolocation())
        expect(typeof result.current.requestLocation).toBe('function')
    })

    it('should set loading to true when requesting location', () => {
        Object.defineProperty(global, 'navigator', {
            value: {
                geolocation: {
                    getCurrentPosition: () => { }
                }
            },
            writable: true
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.requestLocation()
        })

        expect(result.current.loading).toBe(true)
    })

    it('should handle error when geolocation is not supported', () => {
        Object.defineProperty(global, 'navigator', {
            value: {},
            writable: true
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.requestLocation()
        })

        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe('Geolocation not supported')
    })

    it('should set coordinates after successful geolocation', () => {
        vi.useFakeTimers()
        Object.defineProperty(global, 'navigator', {
            value: {
                geolocation: {
                    getCurrentPosition: (success: (pos: GeolocationPosition) => void) => {
                        success({
                            coords: { latitude: 38.191, longitude: -0.565 },
                        } as GeolocationPosition)
                    }
                }
            },
            writable: true
        })

        const { result } = renderHook(() => useGeolocation())

        act(() => {
            result.current.requestLocation()
        })

        expect(result.current.loading).toBe(true)

        act(() => {
            vi.advanceTimersByTime(1200)
        })

        expect(result.current.loading).toBe(false)
        expect(result.current.locationFound).toBe(true)
        expect(result.current.coordinates).toEqual({ lat: 38.191, lng: -0.565 })
    })
})

describe('useLockBodyScroll', () => {
    it('locks and restores body overflow', () => {
        const original = document.body.style.overflow
        const { rerender, unmount } = renderHook(
            ({ locked }) => useLockBodyScroll(locked),
            { initialProps: { locked: false } }
        )

        expect(document.body.style.overflow).toBe(original)

        rerender({ locked: true })
        expect(document.body.style.overflow).toBe('hidden')

        rerender({ locked: false })
        expect(document.body.style.overflow).toBe(original)

        unmount()
        document.body.style.overflow = original
    })
})

describe('useCMS', () => {
    it('returns fallback data immediately', async () => {
        const { result } = renderHook(() => useCMS())
        expect(result.current.menuProducts.length).toBeGreaterThan(0)
        expect(result.current.featuredProducts.length).toBeGreaterThan(0)
        expect(result.current.settings.seo.title).toBeTruthy()
        await act(async () => {
            await Promise.resolve()
        })
    })
})
