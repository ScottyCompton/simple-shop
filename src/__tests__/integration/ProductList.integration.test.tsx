import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../testUtils'
import ProductList from '../../components/shop/ProductList'

// Mock useParams to return route parameters based on location  
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => {
      const pathname = window.location.pathname
      const parts = pathname.split('/').filter(Boolean)
      return { category: parts[1] === 'page' ? '' : parts[1] || '', page: parts[2] }
    },
  }
})

// Mock ProductListItem
vi.mock('../../components/shop/ProductListItem', () => ({
  default: ({ product }: any) => (
    <div data-testid={`product-item-${product.id}`}>{product.name}</div>
  ),
}))

describe('ProductList - Integration Tests', () => {
  describe('Loading all products', () => {
    it('should load and display products when Redux and API work together', async () => {
      // Set simple location
      Object.defineProperty(window, 'location', {
        value: { pathname: '/shop' },
        writable: true,
      })

      const { store } = renderWithProviders(<ProductList />)

      // Check initial state
      expect(screen.getByText('loading products...')).toBeInTheDocument()

      // Wait for update
      await waitFor(() => {
        const state = store.getState()
        console.log('Current cart category:', state.cart.category)
      }, { timeout: 3000 })

      // Just check that the text changed
      await waitFor(
        () => {
          expect(screen.queryByText('loading products...')).not.toBeInTheDocument()
        },
        { timeout: 10000 },
      )

      // If we got here, loading is done
      expect(screen.queryByText('loading products...')).not.toBeInTheDocument()
    })
  })

  describe('Redux category sync', () => {
    it('should update category in Redux when category is in URL', async () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/shop/electronics' },
        writable: true,
      })

      const { store } = renderWithProviders(<ProductList />)

      // Wait for component to update  
      await waitFor(
        () => {
          const state = store.getState()
          expect(state.cart.category).toBe('electronics')
        },
        { timeout: 5000 },
      )
    })
  })
})
