import React from "react"
import { screen, fireEvent, act } from "@testing-library/react"
import { vi } from "vitest"
import { renderWithProviders } from "../../testUtils"
import CategorySelect from "../../../components/ui/CategorySelect"
import { useGetProductCategoriesQuery } from "@/features/shop/productsApiSlice"

// --- Mock react-router-dom navigate ---
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

// --- Mock productsApiSlice (only the query hook; preserve slice exports) ---
vi.mock("@/features/shop/productsApiSlice", async importOriginal => {
  const actual =
    await importOriginal<typeof import("@/features/shop/productsApiSlice")>()
  return { ...actual, useGetProductCategoriesQuery: vi.fn() }
})

// --- Mock Radix UI Select with a plain <select> so we can fire change events ---
vi.mock("@radix-ui/themes", () => ({
  Select: {
    Root: ({
      children,
      onValueChange,
      value,
    }: {
      children: React.ReactNode
      onValueChange?: (v: string) => void
      value?: string
    }) => (
      <select
        data-testid="category-select-root"
        value={value}
        onChange={e => onValueChange?.(e.target.value)}
      >
        {children}
      </select>
    ),
    Trigger: () => null,
    Content: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Group: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Label: () => null,
    Item: ({
      children,
      value,
    }: {
      children: React.ReactNode
      value: string
    }) => <option value={value}>{children}</option>,
  },
}))

const mockQuery = vi.mocked(useGetProductCategoriesQuery)

const loadedState = (categories: string[]) => ({
  data: { categories },
  isLoading: false,
  isUninitialized: false,
  isError: false,
})

const emptyCartState = {
  preloadedState: { cart: { items: [], category: "", shippingTypeId: "" } },
}

describe("CategorySelect", () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  // ── Loading / uninitialized states ──────────────────────────────────────────

  it("shows loading state when query is loading", () => {
    mockQuery.mockReturnValue({
      isLoading: true,
      isUninitialized: false,
      isError: false,
    } as any)
    renderWithProviders(<CategorySelect />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows loading state when query is uninitialized", () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: true,
      isError: false,
    } as any)
    renderWithProviders(<CategorySelect />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("applies animate-pulse class to the loading element", () => {
    mockQuery.mockReturnValue({
      isLoading: true,
      isUninitialized: false,
      isError: false,
    } as any)
    const { container } = renderWithProviders(<CategorySelect />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })

  // ── Error state ─────────────────────────────────────────────────────────────

  it("shows error state when query fails", () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: true,
    } as any)
    renderWithProviders(<CategorySelect />)
    expect(screen.getByText("Error loading")).toBeInTheDocument()
  })

  it("applies the error text colour class on failure", () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: true,
    } as any)
    const { container } = renderWithProviders(<CategorySelect />)
    expect(container.firstChild).toHaveClass("text-red-300")
  })

  // ── Successful data rendering ────────────────────────────────────────────────

  it("renders all category options plus 'All Items' when data is loaded", () => {
    mockQuery.mockReturnValue(
      loadedState(["Electronics", "Clothing", "Books"]) as any,
    )
    renderWithProviders(<CategorySelect />)
    expect(screen.getByText("All Items")).toBeInTheDocument()
    expect(screen.getByText("Electronics")).toBeInTheDocument()
    expect(screen.getByText("Clothing")).toBeInTheDocument()
    expect(screen.getByText("Books")).toBeInTheDocument()
  })

  it("renders each category option with a lowercased value", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics", "Books"]) as any)
    renderWithProviders(<CategorySelect />, emptyCartState)
    const options = screen.getAllByRole("option")
    expect(options[0]).toHaveAttribute("value", "-1")
    expect(options[1]).toHaveAttribute("value", "electronics")
    expect(options[2]).toHaveAttribute("value", "books")
  })

  it("renders an empty list (only 'All Items') when categories array is empty", () => {
    mockQuery.mockReturnValue(loadedState([]) as any)
    renderWithProviders(<CategorySelect />, emptyCartState)
    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveAttribute("value", "-1")
  })

  it("wraps the select in a div with correct min-width classes", () => {
    mockQuery.mockReturnValue(loadedState([]) as any)
    const { container } = renderWithProviders(
      <CategorySelect />,
      emptyCartState,
    )
    expect(container.firstChild).toHaveClass(
      "min-w-[120px]",
      "sm:min-w-[150px]",
    )
  })

  // ── Redux state synchronisation ──────────────────────────────────────────────

  it("defaults to '-1' (All Items) when Redux category is empty", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics"]) as any)
    renderWithProviders(<CategorySelect />, emptyCartState)
    const select = screen.getByTestId(
      "category-select-root",
    ) as HTMLSelectElement
    expect(select.value).toBe("-1")
  })

  it("reflects the current category from Redux state", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics"]) as any)
    renderWithProviders(<CategorySelect />, {
      preloadedState: {
        cart: { items: [], category: "electronics", shippingTypeId: "" },
      },
    })
    const select = screen.getByTestId(
      "category-select-root",
    ) as HTMLSelectElement
    expect(select.value).toBe("electronics")
  })

  it("updates the select value when the Redux category changes", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics"]) as any)
    const { store } = renderWithProviders(<CategorySelect />, emptyCartState)
    act(() => {
      store.dispatch({ type: "cart/setCartCategory", payload: "electronics" })
    })
    const select = screen.getByTestId(
      "category-select-root",
    ) as HTMLSelectElement
    expect(select.value).toBe("electronics")
  })

  // ── onValueChange interactions ───────────────────────────────────────────────

  it("dispatches setCartCategory('') and navigates to /shop when 'All Items' is selected", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics"]) as any)
    const { store } = renderWithProviders(<CategorySelect />, {
      preloadedState: {
        cart: { items: [], category: "electronics", shippingTypeId: "" },
      },
    })
    fireEvent.change(screen.getByTestId("category-select-root"), {
      target: { value: "-1" },
    })
    expect(store.getState().cart.category).toBe("")
    expect(mockNavigate).toHaveBeenCalledWith("/shop")
  })

  it("dispatches setCartCategory(value) and navigates to /shop/:category when a category is selected", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics"]) as any)
    const { store } = renderWithProviders(<CategorySelect />, emptyCartState)
    fireEvent.change(screen.getByTestId("category-select-root"), {
      target: { value: "electronics" },
    })
    expect(store.getState().cart.category).toBe("electronics")
    expect(mockNavigate).toHaveBeenCalledWith("/shop/electronics")
  })

  it("does not navigate more than once per selection", () => {
    mockQuery.mockReturnValue(loadedState(["Electronics"]) as any)
    renderWithProviders(<CategorySelect />, emptyCartState)
    fireEvent.change(screen.getByTestId("category-select-root"), {
      target: { value: "electronics" },
    })
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})
