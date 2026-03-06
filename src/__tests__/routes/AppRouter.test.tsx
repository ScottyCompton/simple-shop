import { render, screen } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import AppRouter from "../../routes/AppRouter"

// Mock all page components
vi.mock("../../page/", () => ({
  Home: () => <div data-testid="page-home">Home</div>,
  Shop: () => <div data-testid="page-shop">Shop</div>,
  Cart: () => <div data-testid="page-cart">Cart</div>,
  ProductDetails: () => <div data-testid="page-product-details">Product Details</div>,
  Checkout: () => <div data-testid="page-checkout">Checkout</div>,
  Login: () => <div data-testid="page-login">Login</div>,
  AuthCallback: () => <div data-testid="page-auth-callback">Auth Callback</div>,
  Profile: () => <div data-testid="page-profile">Profile</div>,
  ThankYou: () => <div data-testid="page-thank-you">Thank You</div>,
}))

// Mock Layout to render its Outlet so child routes are visible
vi.mock("@/components/Layout", async () => {
  const { Outlet } = await import("react-router-dom")
  return {
    default: () => (
      <div data-testid="layout">
        <Outlet />
      </div>
    ),
  }
})

// Mock ThemeTest page
vi.mock("@/page/ThemeTest", () => ({
  default: () => <div data-testid="page-theme-test">Theme Test</div>,
}))

// Mock ProtectedRoute to pass children through with a marker wrapper
vi.mock("../../routes/ProtectedRoute", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}))

const navigate = (path: string) => window.history.pushState({}, "", path)

describe("AppRouter", () => {
  beforeEach(() => {
    navigate("/")
  })

  it("renders without crashing", () => {
    render(<AppRouter />)
    expect(screen.getByTestId("layout")).toBeInTheDocument()
  })

  it("wraps all routes inside the Layout component", () => {
    render(<AppRouter />)
    expect(screen.getByTestId("layout")).toBeInTheDocument()
  })

  describe("Public routes", () => {
    it("renders Home page at /", () => {
      navigate("/")
      render(<AppRouter />)
      expect(screen.getByTestId("page-home")).toBeInTheDocument()
    })

    it("renders Shop page at /shop", () => {
      navigate("/shop")
      render(<AppRouter />)
      expect(screen.getByTestId("page-shop")).toBeInTheDocument()
    })

    it("renders Shop page at /shop/page/:page", () => {
      navigate("/shop/page/2")
      render(<AppRouter />)
      expect(screen.getByTestId("page-shop")).toBeInTheDocument()
    })

    it("renders Shop page at /shop/:category", () => {
      navigate("/shop/electronics")
      render(<AppRouter />)
      expect(screen.getByTestId("page-shop")).toBeInTheDocument()
    })

    it("renders Shop page at /shop/:category/:page", () => {
      navigate("/shop/electronics/2")
      render(<AppRouter />)
      expect(screen.getByTestId("page-shop")).toBeInTheDocument()
    })

    it("renders ProductDetails at /shop/product/:productId", () => {
      navigate("/shop/product/42")
      render(<AppRouter />)
      expect(screen.getByTestId("page-product-details")).toBeInTheDocument()
    })

    it("renders ThankYou at /shop/thank-you", () => {
      navigate("/shop/thank-you")
      render(<AppRouter />)
      expect(screen.getByTestId("page-thank-you")).toBeInTheDocument()
    })

    it("renders Cart at /cart", () => {
      navigate("/cart")
      render(<AppRouter />)
      expect(screen.getByTestId("page-cart")).toBeInTheDocument()
    })

    it("renders Login at /login", () => {
      navigate("/login")
      render(<AppRouter />)
      expect(screen.getByTestId("page-login")).toBeInTheDocument()
    })

    it("renders AuthCallback at /auth/callback", () => {
      navigate("/auth/callback")
      render(<AppRouter />)
      expect(screen.getByTestId("page-auth-callback")).toBeInTheDocument()
    })

    it("renders ThemeTest at /theme-test", () => {
      navigate("/theme-test")
      render(<AppRouter />)
      expect(screen.getByTestId("page-theme-test")).toBeInTheDocument()
    })
  })

  describe("Protected routes", () => {
    it("wraps Checkout with ProtectedRoute at /checkout", () => {
      navigate("/checkout")
      render(<AppRouter />)
      expect(screen.getByTestId("protected-route")).toBeInTheDocument()
      expect(screen.getByTestId("page-checkout")).toBeInTheDocument()
    })

    it("renders Checkout page content inside ProtectedRoute", () => {
      navigate("/checkout")
      render(<AppRouter />)
      const protectedRoute = screen.getByTestId("protected-route")
      expect(protectedRoute).toContainElement(screen.getByTestId("page-checkout"))
    })

    it("wraps Profile with ProtectedRoute at /profile", () => {
      navigate("/profile")
      render(<AppRouter />)
      expect(screen.getByTestId("protected-route")).toBeInTheDocument()
      expect(screen.getByTestId("page-profile")).toBeInTheDocument()
    })

    it("renders Profile page content inside ProtectedRoute", () => {
      navigate("/profile")
      render(<AppRouter />)
      const protectedRoute = screen.getByTestId("protected-route")
      expect(protectedRoute).toContainElement(screen.getByTestId("page-profile"))
    })

    it("does not wrap Cart with ProtectedRoute", () => {
      navigate("/cart")
      render(<AppRouter />)
      expect(screen.queryByTestId("protected-route")).not.toBeInTheDocument()
      expect(screen.getByTestId("page-cart")).toBeInTheDocument()
    })

    it("does not wrap Login with ProtectedRoute", () => {
      navigate("/login")
      render(<AppRouter />)
      expect(screen.queryByTestId("protected-route")).not.toBeInTheDocument()
      expect(screen.getByTestId("page-login")).toBeInTheDocument()
    })

    it("does not wrap Home with ProtectedRoute", () => {
      navigate("/")
      render(<AppRouter />)
      expect(screen.queryByTestId("protected-route")).not.toBeInTheDocument()
      expect(screen.getByTestId("page-home")).toBeInTheDocument()
    })

    it("does not wrap Shop with ProtectedRoute", () => {
      navigate("/shop")
      render(<AppRouter />)
      expect(screen.queryByTestId("protected-route")).not.toBeInTheDocument()
      expect(screen.getByTestId("page-shop")).toBeInTheDocument()
    })
  })
})
