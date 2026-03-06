import { screen } from "@testing-library/react"
import { renderWithProviders } from "../../testUtils"
import CartContents from "../../../components/ui/CartContents"

describe("CartContents", () => {
  it("renders a link to /cart", () => {
    renderWithProviders(<CartContents />)
    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/cart")
  })

  it("displays 0 items when the cart is empty", () => {
    renderWithProviders(<CartContents />, {
      preloadedState: { cart: { items: [], category: "", shippingTypeId: "" } },
    })
    expect(screen.getByRole("link")).toHaveTextContent("0 items")
  })

  it("displays the correct count when the cart has items", () => {
    renderWithProviders(<CartContents />, {
      preloadedState: {
        cart: {
          items: [
            { id: 1, name: "Widget", price: 9.99, qty: 1 },
            { id: 2, name: "Gadget", price: 4.99, qty: 3 },
          ],
          category: "",
          shippingTypeId: "",
        },
      },
    })
    expect(screen.getByRole("link")).toHaveTextContent("2 items")
  })

  it("applies the text-xs class to the link", () => {
    renderWithProviders(<CartContents />)
    expect(screen.getByRole("link")).toHaveClass("text-xs")
  })

  it("renders the shopping cart icon", () => {
    renderWithProviders(<CartContents />)
    const svg = document.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
