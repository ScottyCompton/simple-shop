import { render, screen } from "@testing-library/react"
import ThankYou from "../../page/ThankYou"

describe("ThankYou page", () => {
  it("renders the thank you message", () => {
    render(<ThankYou />)
    expect(screen.getByText(/thank you for your order/i)).toBeInTheDocument()
  })
})
