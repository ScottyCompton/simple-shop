import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest"
import AuthCallback from "../../page/AuthCallback"
import type { User } from "../../types"

// --- Mock useNavigate while keeping the rest of react-router-dom real ---
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// --- Mock Redux dispatch ---
const mockDispatch = vi.fn()
vi.mock("@/app/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
}))

// --- Mock safeGetUserFromToken ---
const mockSafeGetUserFromToken = vi.fn()
vi.mock("@/utils/authHelpers", () => ({
  safeGetUserFromToken: (token: string) => mockSafeGetUserFromToken(token),
}))

// ---------------------------------------------------------------------------

const mockUser: User = {
  id: 1,
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  hasBilling: false,
  hasShipping: false,
  lastUpdate: "2024-01-01T00:00:00.000Z",
}

const renderAuthCallback = (search = "?token=abc123") =>
  render(
    <MemoryRouter initialEntries={[`/auth/callback${search}`]}>
      <AuthCallback />
    </MemoryRouter>,
  )

// ---------------------------------------------------------------------------

describe("AuthCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockSafeGetUserFromToken.mockResolvedValue(mockUser)
  })

  afterEach(() => {
    localStorage.clear()
  })

  // -------------------------------------------------------------------------
  describe("loading state", () => {
    it("shows the loading text while the async flow is in flight", () => {
      // Before any async operation settles, the loading UI is rendered
      renderAuthCallback()
      expect(screen.getByText("Logging you in...")).toBeInTheDocument()
    })

    it("does not show an error while loading", () => {
      renderAuthCallback()
      expect(
        screen.queryByRole("button", { name: /return to login/i }),
      ).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  describe("error: no token in the URL", () => {
    it("shows 'No authentication token received'", async () => {
      renderAuthCallback("")
      await waitFor(() => {
        expect(
          screen.getByText("No authentication token received"),
        ).toBeInTheDocument()
      })
    })

    it("shows a 'Return to Login' button", async () => {
      renderAuthCallback("")
      const btn = await screen.findByRole("button", { name: /return to login/i })
      expect(btn).toBeInTheDocument()
    })

    it("navigates to /login when the 'Return to Login' button is clicked", async () => {
      const user = userEvent.setup()
      renderAuthCallback("")
      const btn = await screen.findByRole("button", { name: /return to login/i })
      await user.click(btn)
      expect(mockNavigate).toHaveBeenCalledWith("/login")
    })

    it("does not call safeGetUserFromToken when token is absent", async () => {
      renderAuthCallback("")
      await screen.findByRole("button", { name: /return to login/i })
      expect(mockSafeGetUserFromToken).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  describe("error: safeGetUserFromToken returns null", () => {
    it("shows 'Failed to get user data'", async () => {
      mockSafeGetUserFromToken.mockResolvedValue(null)
      renderAuthCallback()
      await waitFor(() => {
        expect(screen.getByText("Failed to get user data")).toBeInTheDocument()
      })
    })
  })

  // -------------------------------------------------------------------------
  describe("error: safeGetUserFromToken throws", () => {
    it("shows 'Failed to retrieve your user information'", async () => {
      mockSafeGetUserFromToken.mockRejectedValue(new Error("Token decode error"))
      renderAuthCallback()
      await waitFor(() => {
        expect(
          screen.getByText("Failed to retrieve your user information"),
        ).toBeInTheDocument()
      })
    })
  })

  // -------------------------------------------------------------------------
  describe("error: localStorage throws on setItem", () => {
    it("shows 'Authentication failed. Please try again.'", async () => {
      const spy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("QuotaExceededError")
        })

      renderAuthCallback()
      await waitFor(() => {
        expect(
          screen.getByText("Authentication failed. Please try again."),
        ).toBeInTheDocument()
      })

      spy.mockRestore()
    })
  })

  // -------------------------------------------------------------------------
  describe("successful authentication", () => {
    it("stores the token in localStorage under 'authToken'", async () => {
      renderAuthCallback("?token=my-jwt-token")
      await waitFor(() => {
        expect(localStorage.getItem("authToken")).toBe("my-jwt-token")
      })
    })

    it("stores the provider under 'lastAuthProvider' when present", async () => {
      renderAuthCallback("?token=my-jwt&provider=google")
      await waitFor(() => {
        expect(localStorage.getItem("lastAuthProvider")).toBe("google")
      })
    })

    it("does not set 'lastAuthProvider' when provider param is absent", async () => {
      renderAuthCallback("?token=my-jwt")
      await waitFor(() => {
        expect(localStorage.getItem("authToken")).toBe("my-jwt")
      })
      expect(localStorage.getItem("lastAuthProvider")).toBeNull()
    })

    it("passes the token to safeGetUserFromToken", async () => {
      renderAuthCallback("?token=special-token")
      await waitFor(() => {
        expect(mockSafeGetUserFromToken).toHaveBeenCalledWith("special-token")
      })
    })

    it("dispatches setUser with user data and a fresh lastUpdate timestamp", async () => {
      renderAuthCallback()
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/setUser",
            payload: expect.objectContaining({
              id: mockUser.id,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              email: mockUser.email,
              lastUpdate: expect.any(String),
            }),
          }),
        )
      })
    })

    // -----------------------------------------------------------------------
    describe("navigation — no authIntent", () => {
      it("navigates to /shop when no authRedirect is stored", async () => {
        renderAuthCallback()
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/shop")
        })
      })

      it("navigates to stored authRedirect when present", async () => {
        localStorage.setItem("authRedirect", "/wishlist")
        renderAuthCallback()
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/wishlist")
        })
      })

      it("removes authRedirect from localStorage after navigating", async () => {
        localStorage.setItem("authRedirect", "/wishlist")
        renderAuthCallback()
        await waitFor(() => {
          expect(localStorage.getItem("authRedirect")).toBeNull()
        })
      })
    })

    // -----------------------------------------------------------------------
    describe("navigation — with authIntent", () => {
      it("navigates to /profile when authIntent is set but no authRedirect", async () => {
        localStorage.setItem("authIntent", "connect")
        renderAuthCallback()
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })
      })

      it("navigates to stored authRedirect when authIntent is set", async () => {
        localStorage.setItem("authIntent", "connect")
        localStorage.setItem("authRedirect", "/profile/connections")
        renderAuthCallback()
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/profile/connections")
        })
      })

      it("removes authIntent from localStorage after processing", async () => {
        localStorage.setItem("authIntent", "connect")
        renderAuthCallback()
        await waitFor(() => {
          expect(localStorage.getItem("authIntent")).toBeNull()
        })
      })

      it("removes authRedirect from localStorage when authIntent flow is used", async () => {
        localStorage.setItem("authIntent", "connect")
        localStorage.setItem("authRedirect", "/profile/connections")
        renderAuthCallback()
        await waitFor(() => {
          expect(localStorage.getItem("authRedirect")).toBeNull()
        })
      })
    })
  })
})
