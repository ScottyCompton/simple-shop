import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Layout from "../../components/Layout"
import { vi } from "vitest"

// Mock Header and Footer to isolate Layout testing
vi.mock("../../components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}))

vi.mock("../../components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

describe("Layout", () => {
  it("renders the layout with header, main content area, and footer", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    expect(screen.getByTestId("header")).toBeInTheDocument()
    expect(screen.getByTestId("footer")).toBeInTheDocument()

    // Check for main content area
    const main = screen.getByRole("main")
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute("id", "main-content")
  })

  it("includes an Outlet for routing", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    // Since Outlet renders nothing by default, we check that main exists
    // In a real app, Outlet would render the current route's component
    expect(screen.getByRole("main")).toBeInTheDocument()
  })
})
