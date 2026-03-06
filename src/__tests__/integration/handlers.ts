import { http, HttpResponse } from "msw"
import type { Product, Category, ProductDetail } from "../../types"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
    category: "electronics",
    shortDesc: "High-performance laptop",
    inStock: true,
    imgUrl: "https://via.placeholder.com/300x200",
    mfgName: "TechBrand",
  },
  {
    id: 2,
    name: "Mouse",
    price: 50,
    category: "electronics",
    shortDesc: "Wireless mouse",
    inStock: true,
    imgUrl: "https://via.placeholder.com/300x200",
    mfgName: "TechBrand",
  },
  {
    id: 3,
    name: "Keyboard",
    price: 150,
    category: "electronics",
    shortDesc: "Mechanical keyboard",
    inStock: true,
    imgUrl: "https://via.placeholder.com/300x200",
    mfgName: "TechBrand",
  },
  {
    id: 4,
    name: "Monitor",
    price: 400,
    category: "electronics",
    shortDesc: "27 inch 4K monitor",
    inStock: true,
    imgUrl: "https://via.placeholder.com/300x200",
    mfgName: "TechBrand",
  },
]

const mockCategories: Category[] = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" },
]

export const handlers = [
  // Get all products with optional pagination
  http.get(`${API_URL}/products`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get("page") || "1"
    const pageNum = parseInt(page)

    return HttpResponse.json({
      data: {
        products: mockProducts.slice(0, 2),
        pagination: {
          currentPage: pageNum,
          pageSize: 2,
          totalItems: mockProducts.length,
          totalPages: Math.ceil(mockProducts.length / 2),
        },
      },
    })
  }),

  // Get products by category
  http.get(`${API_URL}/products/:category`, ({ params }) => {
    const { category } = params
    const filtered = mockProducts.filter(p => p.category === category)

    return HttpResponse.json({
      data: {
        products: filtered,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalItems: filtered.length,
          totalPages: 1,
        },
      },
    })
  }),

  // Get products by category and page
  http.get(`${API_URL}/products/:category/:page`, ({ params }) => {
    const { category, page } = params
    const pageNum = parseInt(page as string)
    const filtered = mockProducts.filter(p => p.category === category)
    const pageSize = 2

    return HttpResponse.json({
      data: {
        products: filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize),
        pagination: {
          currentPage: pageNum,
          pageSize,
          totalItems: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize),
        },
      },
    })
  }),

  // Get product by page (no category)
  http.get(`${API_URL}/products/page/:page`, ({ params }) => {
    const { page } = params
    const pageNum = parseInt(page as string)
    const pageSize = 2

    return HttpResponse.json({
      data: {
        products: mockProducts.slice(
          (pageNum - 1) * pageSize,
          pageNum * pageSize,
        ),
        pagination: {
          currentPage: pageNum,
          pageSize,
          totalItems: mockProducts.length,
          totalPages: Math.ceil(mockProducts.length / pageSize),
        },
      },
    })
  }),

  // Get product details
  http.get(`${API_URL}/product/:id`, ({ params }) => {
    const { id } = params
    const product = mockProducts.find(p => p.id === parseInt(id as string))

    if (!product) {
      return HttpResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return HttpResponse.json({
      data: {
        product: {
          ...product,
          longDesc: "This is a detailed description of the product.",
        },
      },
    })
  }),

  // Get categories
  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json({
      data: mockCategories,
    })
  }),

  // Get home categories
  http.get(`${API_URL}/categories/home`, () => {
    return HttpResponse.json({
      data: mockCategories.slice(0, 2),
    })
  }),

  // User auth login
  http.post(`${API_URL}/users/auth`, async ({ request }) => {
    const body = (await request.json()) as any

    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json({
        data: {
          user: {
            id: 1,
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
          },
          token: "mock-jwt-token",
        },
      })
    }

    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }),

  // Get current user
  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get("authorization")

    if (authHeader?.startsWith("Bearer mock-jwt-token")) {
      return HttpResponse.json({
        data: {
          id: 1,
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      })
    }

    return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
  }),
]
