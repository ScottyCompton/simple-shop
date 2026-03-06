import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import HomeCats from "../../../components/shop/HomeCats"
import { vi } from "vitest"
import type { HomeCategory } from "../../../types"

// Mock the RTK Query hook
const mockUseGetHomeProductCategoriesQuery = vi.fn()
vi.mock("../../../features/shop/productsApiSlice", () => ({
  useGetHomeProductCategoriesQuery: () =>
    mockUseGetHomeProductCategoriesQuery(),
}))

// Mock Redux hooks
const mockDispatch = vi.fn()
vi.mock("../../../app/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCategories: HomeCategory[] = [
  {
    name: "Electronics",
    imgUrl: "https://example.com/electronics.jpg",
    productCount: 25,
  },
  { name: "Books", imgUrl: "https://example.com/books.jpg", productCount: 10 },
]

describe("HomeCats", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows loading state initially", () => {
    mockUseGetHomeProductCategoriesQuery.mockReturnValue({
      isLoading: true,
      isUninitialized: false,
      isError: false,
      data: null,
    })

    render(
      <BrowserRouter>
        <HomeCats />
      </BrowserRouter>,
    )

    expect(screen.getByText("Loading products...")).toBeInTheDocument()
  })

  it("shows error state when query fails", () => {
    mockUseGetHomeProductCategoriesQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: true,
      data: null,
    })

    render(
      <BrowserRouter>
        <HomeCats />
      </BrowserRouter>,
    )

    expect(
      screen.getByText("No categories found - he's dead, Jim!"),
    ).toBeInTheDocument()
  })

  it("renders categories when data is available", async () => {
    mockUseGetHomeProductCategoriesQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { categories: mockCategories },
    })

    render(
      <BrowserRouter>
        <HomeCats />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByAltText("Electronics")).toBeInTheDocument()
      expect(screen.getByAltText("Books")).toBeInTheDocument()
    })

    expect(screen.getByText("Electronics (25)")).toBeInTheDocument()
    expect(screen.getByText("Books (10)")).toBeInTheDocument()
  })

  it("navigates and dispatches on category click", async () => {
    mockUseGetHomeProductCategoriesQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { categories: mockCategories },
    })

    render(
      <BrowserRouter>
        <HomeCats />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByAltText("Electronics")).toBeInTheDocument()
    })

    const electronicsImage = screen.getByAltText("Electronics")
    fireEvent.click(electronicsImage)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "cart/setCartCategory",
      payload: "Electronics",
    })
    expect(mockNavigate).toHaveBeenCalledWith("/shop/electronics")
  })

  it("handles span click correctly", async () => {
    mockUseGetHomeProductCategoriesQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { categories: mockCategories },
    })

    render(
      <BrowserRouter>
        <HomeCats />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText("Books (10)")).toBeInTheDocument()
    })

    const booksSpan = screen.getByText("Books (10)")
    fireEvent.click(booksSpan)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "cart/setCartCategory",
      payload: "Books",
    })
    expect(mockNavigate).toHaveBeenCalledWith("/shop/books")
  })
})
