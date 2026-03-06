import { screen } from "@testing-library/react"
import { vi } from "vitest"
import Home from "../../page/Home"
import { renderWithProviders } from "../testUtils"

vi.mock("@/components/shop/HomeCats", () => ({
  default: () => <div data-testid="home-cats-mock" />,
}))

describe("Home page", () => {
  it("renders the welcome heading", () => {
    renderWithProviders(<Home />)
    expect(
      screen.getByRole("heading", { level: 1, name: /welcome to \[simple shop\]/i }),
    ).toBeInTheDocument()
  })

  it("renders the tagline text", () => {
    renderWithProviders(<Home />)
    expect(
      screen.getByText(/the #1 place on the internet to buy stuff you don't need/i),
    ).toBeInTheDocument()
  })

  it("renders the explore inventory text", () => {
    renderWithProviders(<Home />)
    expect(screen.getByText(/explore our vast inventory below/i)).toBeInTheDocument()
  })

  it("renders the HomeCats component", () => {
    renderWithProviders(<Home />)
    expect(screen.getByTestId("home-cats-mock")).toBeInTheDocument()
  })

  it("dispatches setCartCategory with empty string on mount", () => {
    const { store } = renderWithProviders(<Home />, {
      preloadedState: { cart: { items: [], category: "electronics", shippingTypeId: "" } },
    })
    expect(store.getState().cart.category).toBe("")
  })
})
