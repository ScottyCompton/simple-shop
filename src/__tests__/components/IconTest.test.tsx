import { render, screen } from "@testing-library/react"
import IconTest from "../../components/IconTest"

describe("IconTest", () => {
  it("renders Google and GitHub icons", () => {
    render(<IconTest />)

    // Check for FontAwesome icons (they have specific classes)
    const icons = screen.getAllByRole("img", { hidden: true }) // SVGs are treated as images
    expect(icons).toHaveLength(2)

    // Check if they have the correct data-icon attributes
    expect(icons[0]).toHaveAttribute("data-icon", "google")
    expect(icons[1]).toHaveAttribute("data-icon", "github")
  })
})
