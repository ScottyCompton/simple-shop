import { screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { renderWithProviders } from "../../../testUtils"
import CheckoutForm from "../../../../components/shop/checkout/CheckoutForm"
import type { User } from "../../../../types"

// ── Mock react-router so useNavigate is controllable ────────────────────────
const mockNavigate = vi.fn()
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router")
  return { ...actual, useNavigate: () => mockNavigate }
})

// ── Stub out heavyweight child components ────────────────────────────────────
vi.mock("../../../../components/shop/cart/CartSummary", () => ({
  default: () => <div data-testid="cart-summary">Cart Summary</div>,
}))

vi.mock("../../../../components/shop/checkout/CheckoutBillingShipping", () => ({
  default: () => (
    <div data-testid="checkout-billing-shipping">Billing and Shipping</div>
  ),
}))

vi.mock("../../../../components/shop/checkout/CheckoutPayment", () => ({
  default: ({
    onChange,
  }: {
    onChange: (data: {
      ccNumber: string
      ccExpiry: string
      ccCVV: string
    }) => void
  }) => (
    <div data-testid="checkout-payment">
      <button
        onClick={() =>
          onChange({ ccNumber: "4111111111111111", ccExpiry: "12/25", ccCVV: "123" })
        }
      >
        Fill Payment
      </button>
    </div>
  ),
}))

vi.mock(
  "../../../../components/shop/checkout/components/ProcessOrderDialog",
  () => ({
    default: ({
      isOpen,
      doClose,
    }: {
      isOpen: boolean
      doClose: (navTo?: string) => void
    }) =>
      isOpen ? (
        <div data-testid="process-order-dialog">
          <button onClick={() => doClose()}>Close Dialog</button>
          <button onClick={() => doClose("/orders")}>Navigate After Close</button>
        </div>
      ) : null,
  }),
)

// ── Shared test data ─────────────────────────────────────────────────────────
const mockUserWithBilling: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  hasBilling: true,
  hasShipping: true,
  lastUpdate: "2024-01-01",
}

const mockUserNoBilling: User = {
  ...mockUserWithBilling,
  hasBilling: false,
  hasShipping: false,
}

const noShippingState = {
  cart: { items: [], category: "", shippingTypeId: "" },
  user: { user: null },
}

const withShippingState = {
  cart: { items: [], category: "", shippingTypeId: "1" },
  user: { user: mockUserWithBilling },
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const clickNextToBillingShipping = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /2\. Billing And Shipping/i }),
  )

const clickNextToPayment = () =>
  fireEvent.click(
    screen.getByRole("button", { name: /3\. Payment Information/i }),
  )

// ── Tests ────────────────────────────────────────────────────────────────────
describe("CheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Initial render ─────────────────────────────────────────────────────────
  describe("initial render", () => {
    it("renders the Checkout heading", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      expect(screen.getByText("Checkout")).toBeInTheDocument()
    })

    it("renders all three accordion section headings", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      expect(screen.getByText("Shopping Cart Contents")).toBeInTheDocument()
      expect(
        screen.getByText("Billing and Shipping Information"),
      ).toBeInTheDocument()
      expect(screen.getByText("Payment Information")).toBeInTheDocument()
    })

    it("renders CartSummary in the first accordion section", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      expect(screen.getByTestId("cart-summary")).toBeInTheDocument()
    })

    it("does not show ProcessOrderDialog by default", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      expect(
        screen.queryByTestId("process-order-dialog"),
      ).not.toBeInTheDocument()
    })

    it("section 1 accordion trigger is expanded by default", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      expect(
        screen.getByRole("button", { name: /Shopping Cart Contents/i }),
      ).toHaveAttribute("aria-expanded", "true")
    })
  })

  // ── Step 1 navigation ──────────────────────────────────────────────────────
  describe("step 1 navigation", () => {
    it("disables the 'Billing And Shipping' button when no shipping type is selected", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      expect(
        screen.getByRole("button", { name: /2\. Billing And Shipping/i }),
      ).toBeDisabled()
    })

    it("enables the 'Billing And Shipping' button when a shipping type is selected", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      expect(
        screen.getByRole("button", { name: /2\. Billing And Shipping/i }),
      ).not.toBeDisabled()
    })

    it("calls navigate(-1) when 'Continue Shopping' is clicked", () => {
      renderWithProviders(<CheckoutForm />, { preloadedState: noShippingState })
      fireEvent.click(
        screen.getByRole("button", { name: /Continue Shopping/i }),
      )
      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    it("opens section 2 when the next button is clicked with a shipping type set", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      clickNextToBillingShipping()
      expect(
        screen.getByRole("button", {
          name: /Billing and Shipping Information/i,
        }),
      ).toHaveAttribute("aria-expanded", "true")
    })
  })

  // ── Accordion guard: section 2 trigger ────────────────────────────────────
  describe("accordion guard — section 2 trigger", () => {
    it("keeps section 1 open when the section 2 header is clicked without a shipping type", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: {
          cart: { items: [], category: "", shippingTypeId: "" },
          user: { user: mockUserWithBilling },
        },
      })
      const section2Header = screen
        .getByRole("button", { name: /Billing and Shipping Information/i })
      fireEvent.click(section2Header)
      expect(
        screen.getByRole("button", { name: /Shopping Cart Contents/i }),
      ).toHaveAttribute("aria-expanded", "true")
    })
  })

  // ── Step 2 navigation ──────────────────────────────────────────────────────
  describe("step 2 navigation", () => {
    it("disables the 'Payment Information' button when user has no billing/shipping info", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: {
          cart: { items: [], category: "", shippingTypeId: "1" },
          user: { user: mockUserNoBilling },
        },
      })
      clickNextToBillingShipping()
      expect(
        screen.getByRole("button", { name: /3\. Payment Information/i }),
      ).toBeDisabled()
    })

    it("enables the 'Payment Information' button when user has billing and shipping info", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      clickNextToBillingShipping()
      expect(
        screen.getByRole("button", { name: /3\. Payment Information/i }),
      ).not.toBeDisabled()
    })

    it("navigates back to section 1 when the back button is clicked", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      clickNextToBillingShipping()
      fireEvent.click(
        screen.getByRole("button", { name: /1\. Cart Summary/i }),
      )
      expect(
        screen.getByRole("button", { name: /Shopping Cart Contents/i }),
      ).toHaveAttribute("aria-expanded", "true")
    })

    it("opens section 3 when the 'Payment Information' next button is clicked", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      clickNextToBillingShipping()
      clickNextToPayment()
      expect(
        screen.getByRole("button", { name: /Shopping Cart Contents/i }),
      ).toHaveAttribute("aria-expanded", "false")
    })
  })

  // ── Accordion guard: section 3 trigger ────────────────────────────────────
  describe("accordion guard — section 3 trigger", () => {
    it("keeps section 2 open when the section 3 header is clicked without billing/shipping info", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: {
          cart: { items: [], category: "", shippingTypeId: "1" },
          user: { user: mockUserNoBilling },
        },
      })
      clickNextToBillingShipping()
      // Clicking the section 3 accordion header should be blocked
      const section3Header = screen.getAllByRole("button", {
        name: /Payment Information/i,
      })[0]
      fireEvent.click(section3Header)
      expect(
        screen.getByRole("button", {
          name: /Billing and Shipping Information/i,
        }),
      ).toHaveAttribute("aria-expanded", "true")
    })
  })

  // ── Step 3 — Complete Purchase ─────────────────────────────────────────────
  describe("step 3 — Complete Purchase", () => {
    const navigateToSection3 = () => {
      clickNextToBillingShipping()
      clickNextToPayment()
    }

    it("shows ProcessOrderDialog when 'Complete Purchase' is clicked", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      navigateToSection3()
      fireEvent.click(
        screen.getByRole("button", { name: /Complete Purchase/i }),
      )
      expect(screen.getByTestId("process-order-dialog")).toBeInTheDocument()
    })

    it("navigates back to section 2 when the back button in section 3 is clicked", () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      navigateToSection3()
      fireEvent.click(
        screen.getByRole("button", { name: /2\. Shipping & Billing/i }),
      )
      expect(
        screen.getByRole("button", {
          name: /Billing and Shipping Information/i,
        }),
      ).toHaveAttribute("aria-expanded", "true")
    })

    it("hides ProcessOrderDialog when doClose is called without a navigation path", async () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      navigateToSection3()
      fireEvent.click(
        screen.getByRole("button", { name: /Complete Purchase/i }),
      )
      expect(screen.getByTestId("process-order-dialog")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: /Close Dialog/i }))

      await waitFor(() => {
        expect(
          screen.queryByTestId("process-order-dialog"),
        ).not.toBeInTheDocument()
      })
    })

    it("calls navigate with the path when doClose is called with a navigation path", async () => {
      renderWithProviders(<CheckoutForm />, {
        preloadedState: withShippingState,
      })
      navigateToSection3()
      fireEvent.click(
        screen.getByRole("button", { name: /Complete Purchase/i }),
      )
      fireEvent.click(
        screen.getByRole("button", { name: /Navigate After Close/i }),
      )
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/orders")
      })
    })
  })
})
