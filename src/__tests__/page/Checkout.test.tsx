import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"
import Checkout from "../../page/Checkout"

vi.mock("@/components/shop/checkout/CheckoutForm", () => ({
  default: () => <div data-testid="checkout-form-mock" />,
}))

const renderCheckout = () =>
  render(
    <BrowserRouter>
      <Checkout />
    </BrowserRouter>,
  )

describe("Checkout page", () => {
  it("renders without crashing", () => {
    renderCheckout()
    expect(screen.getByTestId("checkout-form-mock")).toBeInTheDocument()
  })

  it("renders the CheckoutForm component", () => {
    renderCheckout()
    expect(screen.getByTestId("checkout-form-mock")).toBeInTheDocument()
  })

  it("wraps content in a div", () => {
    const { container } = renderCheckout()
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement)
  })
})
