import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import CartSummary from "../../../../components/shop/cart/CartSummary"
import { vi } from "vitest"
import type { Mock } from "vitest"
import type { CartItem } from "../../../../types"
import { Provider } from "react-redux"
import { makeStore } from "../../../../app/store"
import type { RootState } from "../../../../app/store"
// Inline type definition to avoid module export error
import type { CartSummaryItemProps } from "@/components/shop/cart/CartSummaryItem"
import type { ShippingSelectProps } from "../../../../components/ui/ShippingSelect"

// Mock Redux selector
const mockUseAppSelector: Mock<
  (
    selector: (state: RootState) => CartItem[] | string | number,
  ) => CartItem[] | string | number
> = vi.fn()
vi.mock("@/app/hooks", () => ({
  useAppSelector: (
    selector: (state: RootState) => CartItem[] | string | number,
  ) => mockUseAppSelector(selector),
}))

// Mock CartSummaryItem
vi.mock("../../../../components/shop/cart/CartSummaryItem", () => ({
  default: (props: CartSummaryItemProps) => (
    <div data-testid={`cart-item-${String(props.cartItemId)}`}>
      Item {props.cartItemId} {props.isCheckout ? "(checkout)" : ""}
    </div>
  ),
}))

// Mock ShippingSelect
vi.mock("../../../../components/ui", () => ({
  ShippingSelect: ({ onSelectShippingType }: ShippingSelectProps) => (
    <select
      data-testid="shipping-select"
      onChange={e => {
        onSelectShippingType(Number(e.target.value))
      }}
    >
      <option value="5">Standard - $5</option>
      <option value="10">Express - $10</option>
    </select>
  ),
}))

const mockCartItems: CartItem[] = [
  { id: 1, name: "Product 1", price: 20, qty: 2 },
  { id: 2, name: "Product 2", price: 15, qty: 1 },
]

describe("CartSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows empty cart message when no items", () => {
    mockUseAppSelector.mockReturnValue([])
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <CartSummary />
        </BrowserRouter>
      </Provider>,
    )
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toBeInTheDocument()
  })

  it("renders cart items and calculates subtotal", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <CartSummary />
        </BrowserRouter>
      </Provider>,
    )
    expect(screen.getByTestId("cart-item-1")).toBeInTheDocument()
    expect(screen.getByTestId("cart-item-2")).toBeInTheDocument()
    expect(screen.getByText("Cart Subtotal:")).toBeInTheDocument()
    expect(screen.getAllByText("$55.00")).toHaveLength(2) // subtotal + total (20*2 + 15*1 = 55, no shipping)
    expect(screen.getByText("Total:")).toBeInTheDocument()
  })

  it("shows checkout buttons when not in checkout mode", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <CartSummary />
        </BrowserRouter>
      </Provider>,
    )
    expect(
      screen.getByRole("link", { name: /proceed to checkout/i }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: /continue shopping/i }),
    ).toHaveLength(1) // only one link when cart is not empty
  })

  it("shows shipping selection in checkout mode", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <CartSummary isCheckout={true} />
        </BrowserRouter>
      </Provider>,
    )
    expect(screen.getByTestId("shipping-select")).toBeInTheDocument()
    expect(screen.getByText("Select Shipping Method:")).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: /proceed to checkout/i }),
    ).not.toBeInTheDocument()
  })

  it("updates total when shipping is selected", async () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <CartSummary isCheckout={true} />
        </BrowserRouter>
      </Provider>,
    )
    const shippingSelect = screen.getByTestId("shipping-select")
    fireEvent.change(shippingSelect, { target: { value: "10" } })
    await waitFor(() => {
      expect(screen.getByText("$65.00")).toBeInTheDocument() // 55 + 10
    })
  })

  it("passes isCheckout prop to cart items", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)
    render(
      <Provider store={makeStore()}>
        <BrowserRouter>
          <CartSummary isCheckout={true} />
        </BrowserRouter>
      </Provider>,
    )
    expect(screen.getByText("Item 1 (checkout)")).toBeInTheDocument()
    expect(screen.getByText("Item 2 (checkout)")).toBeInTheDocument()
  })
})
