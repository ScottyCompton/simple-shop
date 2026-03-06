import { render, screen } from "@testing-library/react"
import Footer from "../../components/Footer"

describe("Footer", () => {
  it("renders the footer with copyright and links", () => {
    render(<Footer />)

    // Check copyright text with current year
    const currentYear = new Date().getFullYear()
    expect(
      screen.getByText(`© ${currentYear} Simple Shop`),
    ).toBeInTheDocument()

    // Check links
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /terms of service/i }),
    ).toBeInTheDocument()

    // Check "All rights reserved"
    expect(screen.getByText("All rights reserved")).toBeInTheDocument()
  })

  it("has correct link attributes", () => {
    render(<Footer />)

    const privacyLink = screen.getByRole("link", { name: /privacy policy/i })
    const termsLink = screen.getByRole("link", { name: /terms of service/i })

    expect(privacyLink).toHaveAttribute("href", "#")
    expect(termsLink).toHaveAttribute("href", "#")
  })
})
