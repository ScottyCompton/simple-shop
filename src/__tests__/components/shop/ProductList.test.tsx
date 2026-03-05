import { render, screen, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import ProductList from "../../../components/shop/ProductList"
import { vi } from "vitest"
import type { Product } from "../../../types"

// Mock the RTK Query hook
const mockUseGetProductsByCategoryQuery = vi.fn()
vi.mock("@/features/shop/productsApiSlice", () => ({
  useGetProductsByCategoryQuery: (params: any) =>
    mockUseGetProductsByCategoryQuery(params),
}))

// Mock Redux hooks
vi.mock("@/app/hooks", () => ({
  useAppDispatch: () => vi.fn(),
}))

// Mock ProductListItem
vi.mock("../ProductListItem", () => ({
  default: ({ product }: { product: Product }) => (
    <div data-testid={`product-item-${product.id}`}>{product.name}</div>
  ),
}))

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

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("product-item-1")).toBeInTheDocument()
      expect(screen.getByTestId("product-item-2")).toBeInTheDocument()
    })

    expect(screen.getByText("All Products")).toBeInTheDocument()
  })

  it("renders pagination when available", async () => {
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
    ]

    mockUseGetProductsByCategoryQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: {
        products: mockProducts,
        pagination: {
          totalPages: 3,
          currentPage: 2,
          pageSize: 10,
          totalItems: 25,
        },
      },
    })

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()
      expect(
        screen.getByRole("link", { name: /previous/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole("link", { name: /next/i })).toBeInTheDocument()
    })
  })
})
