import { render, screen, waitFor, within } from "@testing-library/react"
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom"
import ProductList from "../../../components/shop/ProductList"
import { vi } from "vitest"
import type { Product } from "../../../types"

// Mock the RTK Query hook
const mockUseGetProductsByCategoryQuery = vi.fn()
vi.mock("@/features/shop/productsApiSlice", () => ({
  useGetProductsByCategoryQuery: (params: {
    category: string
    page?: number
  }): ReturnType<typeof mockUseGetProductsByCategoryQuery> =>
    mockUseGetProductsByCategoryQuery(params),
}))

// Mock Redux hooks
import { cartItems } from "@/features/shop/cartSlice"
import type { CartItem } from "../../../types"
vi.mock("@/app/hooks", () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => CartItem[]) => {
    if (selector === cartItems) return []
    return selector([])
  },
}))

// Mock ProductListItem
vi.mock("../ProductListItem", () => ({
  default: ({ product }: { product: Product }) => (
    <div data-testid={`product-item-${String(product.id)}`}>{product.name}</div>
  ),
}))

// Mock QuantitySelect to avoid Theme context dependency
vi.mock("../../../components/ui/QuantitySelect", () => ({
  default: () => <div data-testid="quantity-select-mock" />,
}))

import { Theme } from "@radix-ui/themes"

// Mock window.location
const mockLocation = {
  pathname: "/shop",
}
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
})

describe("ProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows loading state initially", () => {
    mockUseGetProductsByCategoryQuery.mockReturnValue({
      isLoading: true,
      isUninitialized: false,
      isError: false,
      data: null,
    })

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>,
    )

    expect(screen.getByText("loading products...")).toBeInTheDocument()
  })

  it("shows error state when query fails", () => {
    mockUseGetProductsByCategoryQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: true,
      data: null,
    })

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>,
    )

    expect(
      screen.getByText("No products - he's dead, Jim!"),
    ).toBeInTheDocument()
  })

  it("renders products when data is available", async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Product 1",
        price: 10,
        category: "cat",
        shortDesc: "desc",
        inStock: true,
        imgUrl: "url",
        mfgName: "mfg",
      },
      {
        id: 2,
        name: "Product 2",
        price: 20,
        category: "cat",
        shortDesc: "desc",
        inStock: true,
        imgUrl: "url",
        mfgName: "mfg",
      },
    ]

    mockUseGetProductsByCategoryQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: {
        products: mockProducts,
        pagination: {
          totalPages: 1,
          currentPage: 1,
          pageSize: 10,
          totalItems: 2,
        },
      },
    })

    // Wrap in Radix Theme provider
    render(
      <Theme>
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>
      </Theme>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("product-item-1")).toBeInTheDocument()
      expect(screen.getByTestId("product-item-2")).toBeInTheDocument()
    })

    expect(screen.getByText("All Products")).toBeInTheDocument()
  })

  describe("category breadcrumb (lines 53-62)", () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Test Product",
        price: 10,
        category: "electronics",
        shortDesc: "desc",
        inStock: true,
        imgUrl: "url",
        mfgName: "mfg",
      },
    ]

    const successData = {
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { products: mockProducts, pagination: undefined },
    }

    it("renders a link to /shop/:category when category param is present", () => {
      mockLocation.pathname = "/shop/electronics"
      mockUseGetProductsByCategoryQuery.mockReturnValue(successData)

      render(
        <MemoryRouter initialEntries={["/shop/electronics"]}>
          <Routes>
            <Route path="/shop/:category" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      const categoryLink = screen.getByRole("link", { name: "Electronics" })
      expect(categoryLink).toBeInTheDocument()
      expect(categoryLink).toHaveAttribute("href", "/shop/electronics")
    })

    it("title-cases a single-word category name in the breadcrumb link", () => {
      mockLocation.pathname = "/shop/electronics"
      mockUseGetProductsByCategoryQuery.mockReturnValue(successData)

      render(
        <MemoryRouter initialEntries={["/shop/electronics"]}>
          <Routes>
            <Route path="/shop/:category" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      expect(
        screen.getByRole("link", { name: "Electronics" }),
      ).toBeInTheDocument()
    })

    it("title-cases each word of a multi-word category name", () => {
      mockLocation.pathname = "/shop/home goods"
      mockUseGetProductsByCategoryQuery.mockReturnValue(successData)

      render(
        <MemoryRouter initialEntries={["/shop/home goods"]}>
          <Routes>
            <Route path="/shop/:category" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      expect(
        screen.getByRole("link", { name: "Home Goods" }),
      ).toBeInTheDocument()
    })

    it("renders a '>' separator between All Products and the category link", () => {
      mockLocation.pathname = "/shop/electronics"
      mockUseGetProductsByCategoryQuery.mockReturnValue(successData)

      render(
        <MemoryRouter initialEntries={["/shop/electronics"]}>
          <Routes>
            <Route path="/shop/:category" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      const heading = screen.getByRole("heading", { level: 1 })
      expect(heading).toHaveTextContent(">")
    })

    it("does not render the category breadcrumb when no category param is present", () => {
      mockLocation.pathname = "/shop"
      mockUseGetProductsByCategoryQuery.mockReturnValue(successData)

      render(
        <BrowserRouter>
          <ProductList />
        </BrowserRouter>,
      )

      expect(screen.getByText("All Products")).toBeInTheDocument()
      // breadcrumb heading should only contain the "All Products" link — no category link
      const heading = screen.getByRole("heading", { level: 1 })
      expect(within(heading).queryAllByRole("link")).toHaveLength(1)
      expect(within(heading).getByRole("link")).toHaveAttribute("href", "/shop")
    })
  })

  describe("Previous pagination link (lines 72-81)", () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Test Product",
        price: 10,
        category: "electronics",
        shortDesc: "desc",
        inStock: true,
        imgUrl: "url",
        mfgName: "mfg",
      },
    ]

    const paginationData = (currentPage: number, totalPages: number) => ({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: {
        products: mockProducts,
        pagination: { currentPage, totalPages, pageSize: 10, totalItems: 20 },
      },
    })

    it("does not render a Previous link on page 1", () => {
      mockLocation.pathname = "/shop/electronics/1"
      mockUseGetProductsByCategoryQuery.mockReturnValue(paginationData(1, 3))

      render(
        <MemoryRouter initialEntries={["/shop/electronics/1"]}>
          <Routes>
            <Route path="/shop/:category/:page" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      expect(
        screen.queryByRole("link", { name: "Previous" }),
      ).not.toBeInTheDocument()
    })

    it("renders a Previous link pointing to the previous category page", () => {
      mockLocation.pathname = "/shop/electronics/2"
      mockUseGetProductsByCategoryQuery.mockReturnValue(paginationData(2, 3))

      render(
        <MemoryRouter initialEntries={["/shop/electronics/2"]}>
          <Routes>
            <Route path="/shop/:category/:page" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      const prevLink = screen.getByRole("link", { name: "Previous" })
      expect(prevLink).toBeInTheDocument()
      expect(prevLink).toHaveAttribute("href", "/shop/electronics/1")
    })

    it("renders a Previous link pointing to /shop/page/:prevPage when no category", () => {
      mockLocation.pathname = "/shop/page/2"
      mockUseGetProductsByCategoryQuery.mockReturnValue(paginationData(2, 3))

      render(
        <MemoryRouter initialEntries={["/shop/page/2"]}>
          <Routes>
            <Route path="/shop/page/:page" element={<ProductList />} />
          </Routes>
        </MemoryRouter>,
      )

      const prevLink = screen.getByRole("link", { name: "Previous" })
      expect(prevLink).toBeInTheDocument()
      expect(prevLink).toHaveAttribute("href", "/shop/page/1")
    })
  })
})
