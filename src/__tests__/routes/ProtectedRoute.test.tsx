import { screen, waitFor } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"
import ProtectedRoute from "../../routes/ProtectedRoute"
import { renderWithProviders } from "../testUtils"
import * as authUtils from "@/utils/authUtils"
import type { User } from "@/types"

// Mock Navigate and Outlet so we can assert on them without a real router
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to} />
    ),
    Outlet: () => <div data-testid="outlet" />,
  }
})

// Mock authUtils so we control token + fetch behaviour
vi.mock("@/utils/authUtils", () => ({
  isAuthenticated: vi.fn(),
  fetchUserData: vi.fn(),
}))

const mockUser: User = {
  id: 1,
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  hasBilling: false,
  hasShipping: false,
  lastUpdate: "2024-01-01T00:00:00.000Z",
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  describe("loading state", () => {
    it("shows a loading indicator while the auth check is in progress", () => {
      // Keep fetchUserData pending so setIsChecking(false) is never called
      localStorage.setItem("authToken", "valid.jwt.token")
      localStorage.setItem("userId", "42")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(true)
      vi.mocked(authUtils.fetchUserData).mockReturnValue(new Promise(() => {}))

      renderWithProviders(<ProtectedRoute />)
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })
  })

  // -----------------------------------------------------------------------
  // User already in Redux store
  // -----------------------------------------------------------------------
  describe("user in Redux store", () => {
    it("renders <Outlet /> when the store already has a user", async () => {
      renderWithProviders(<ProtectedRoute />, {
        preloadedState: { user: { user: mockUser } },
      })
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )
      expect(screen.getByTestId("outlet")).toBeInTheDocument()
    })

    it("renders children prop instead of <Outlet /> when provided", async () => {
      renderWithProviders(
        <ProtectedRoute>
          <div data-testid="child-content">Protected Content</div>
        </ProtectedRoute>,
        { preloadedState: { user: { user: mockUser } } },
      )
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )
      expect(screen.getByTestId("child-content")).toBeInTheDocument()
    })

    it("does not call fetchUserData when user is already in the store", async () => {
      renderWithProviders(<ProtectedRoute />, {
        preloadedState: { user: { user: mockUser } },
      })
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )
      expect(authUtils.fetchUserData).not.toHaveBeenCalled()
    })
  })

  // -----------------------------------------------------------------------
  // User in localStorage (no Redux store entry)
  // -----------------------------------------------------------------------
  describe("user in localStorage", () => {
    it("renders <Outlet /> after hydrating user from localStorage", async () => {
      localStorage.setItem("user", JSON.stringify(mockUser))
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(false)

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )
      expect(screen.getByTestId("outlet")).toBeInTheDocument()
    })

    it("dispatches setUser with the localStorage data", async () => {
      localStorage.setItem("user", JSON.stringify(mockUser))

      const { store } = renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      const state = store.getState() as { user: { user: User | null } }
      expect(state.user.user).toEqual(mockUser)
    })

    it("does not call fetchUserData when user is in localStorage", async () => {
      localStorage.setItem("user", JSON.stringify(mockUser))

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )
      expect(authUtils.fetchUserData).not.toHaveBeenCalled()
    })
  })

  // -----------------------------------------------------------------------
  // JWT token flow
  // -----------------------------------------------------------------------
  describe("JWT token flow", () => {
    it("fetches user data with the stored userId and renders <Outlet />", async () => {
      localStorage.setItem("authToken", "valid.jwt.token")
      localStorage.setItem("userId", "42")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(true)
      vi.mocked(authUtils.fetchUserData).mockResolvedValue(mockUser)

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(authUtils.fetchUserData).toHaveBeenCalledWith(42)
      expect(screen.getByTestId("outlet")).toBeInTheDocument()
    })

    it("dispatches setUser with the fetched user data", async () => {
      localStorage.setItem("authToken", "valid.jwt.token")
      localStorage.setItem("userId", "42")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(true)
      vi.mocked(authUtils.fetchUserData).mockResolvedValue(mockUser)

      const { store } = renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      const state = store.getState() as { user: { user: User | null } }
      expect(state.user.user).toEqual(mockUser)
    })

    it("redirects to /login when token is present but isAuthenticated returns false", async () => {
      localStorage.setItem("authToken", "expired.jwt.token")
      localStorage.setItem("userId", "42")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(false)

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(screen.getByTestId("navigate")).toHaveAttribute(
        "data-to",
        "/login",
      )
    })

    it("redirects to /login when token is valid but userId is 0", async () => {
      localStorage.setItem("authToken", "valid.jwt.token")
      localStorage.setItem("userId", "0")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(true)

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(screen.getByTestId("navigate")).toHaveAttribute(
        "data-to",
        "/login",
      )
    })

    it("redirects to /login when fetchUserData returns null", async () => {
      localStorage.setItem("authToken", "valid.jwt.token")
      localStorage.setItem("userId", "42")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(true)
      vi.mocked(authUtils.fetchUserData).mockResolvedValue(null)

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(screen.getByTestId("navigate")).toHaveAttribute(
        "data-to",
        "/login",
      )
    })

    it("redirects to /login when fetchUserData throws an error", async () => {
      localStorage.setItem("authToken", "valid.jwt.token")
      localStorage.setItem("userId", "42")
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(true)
      vi.mocked(authUtils.fetchUserData).mockRejectedValue(
        new Error("Network error"),
      )

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(screen.getByTestId("navigate")).toHaveAttribute(
        "data-to",
        "/login",
      )
    })
  })

  // -----------------------------------------------------------------------
  // Unauthenticated (no stored auth at all)
  // -----------------------------------------------------------------------
  describe("unauthenticated", () => {
    it("redirects to /login when there is no user, no localStorage entry, and no token", async () => {
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(false)

      renderWithProviders(<ProtectedRoute />)
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(screen.getByTestId("navigate")).toHaveAttribute(
        "data-to",
        "/login",
      )
    })

    it("does not render protected content when unauthenticated", async () => {
      vi.mocked(authUtils.isAuthenticated).mockReturnValue(false)

      renderWithProviders(
        <ProtectedRoute>
          <div data-testid="secret">Secret</div>
        </ProtectedRoute>,
      )
      await waitFor(() =>
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
      )

      expect(screen.queryByTestId("secret")).not.toBeInTheDocument()
    })
  })
})
