import { screen, fireEvent } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import QuantitySelect from "../../../components/ui/QuantitySelect"
import { renderWithProviders } from "../../testUtils"
import type { Product } from "../../../types"

// Simplify Radix UI to native HTML elements so we can interact with them reliably
vi.mock("@radix-ui/themes", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Flex: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div className={className}>{children}</div>,
  Select: {
    Root: ({
      children,
      value,
      onValueChange,
    }: {
      children: React.ReactNode
      value?: string
      onValueChange?: (val: string) => void
    }) => (
      <select
        data-testid="qty-select"
        value={value}
        onChange={e => onValueChange?.(e.target.value)}
      >
        {children}
      </select>
    ),
    Trigger: () => null,
    Content: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Group: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Label: () => null,
    Item: ({
      value,
      children,
    }: {
      value: string
      children: React.ReactNode
    }) => <option value={value}>{children}</option>,
  },
}))

const mockToastSuccess = vi.fn()
vi.mock("react-hot-toast", () => ({
  default: { success: (...args: unknown[]) => mockToastSuccess(...args) },
}))

const mockProduct: Product = {
  id: 1,
  name: "Test Widget",
  price: 9.99,
  category: "Electronics",
  shortDesc: "A test widget",
  inStock: true,
  imgUrl: "https://example.com/widget.jpg",
  mfgName: "Test Mfg",
}

const emptyCartState = {
  cart: { items: [], category: "", shippingTypeId: "" },
}

const cartStateWithItem = {
  cart: {
    items: [{ id: 1, name: "Test Widget", price: 9.99, qty: 2 }],
    category: "",
    shippingTypeId: "",
  },
}

describe("QuantitySelect", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, "alert").mockImplementation(() => {})
  })

  describe("when product is not in the cart", () => {
    it("renders the qty select and button", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: emptyCartState,
      })
      expect(screen.getByTestId("qty-select")).toBeInTheDocument()
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it('shows "Add To cart" as the button text', () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: emptyCartState,
      })
      expect(screen.getByRole("button")).toHaveTextContent("Add To cart")
    })

    it("disables the button when no quantity has been selected", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: emptyCartState,
      })
      expect(screen.getByRole("button")).toBeDisabled()
    })

    it("does not include 0 as a selectable option", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: emptyCartState,
      })
      const optionValues = screen
        .getAllByRole("option")
        .map(o => o.getAttribute("value"))
      expect(optionValues).not.toContain("0")
    })

    it("shows qty options 1 through 10", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: emptyCartState,
      })
      expect(screen.getAllByRole("option")).toHaveLength(10)
    })

    it("enables the button after a quantity is selected", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: emptyCartState,
      })
      fireEvent.change(screen.getByTestId("qty-select"), {
        target: { value: "3" },
      })
      expect(screen.getByRole("button")).not.toBeDisabled()
    })

    it("dispatches addUpdateCart and shows a success toast when adding to cart", () => {
      const { store } = renderWithProviders(
        <QuantitySelect product={mockProduct} />,
        { preloadedState: emptyCartState },
      )
      fireEvent.change(screen.getByTestId("qty-select"), {
        target: { value: "2" },
      })
      fireEvent.click(screen.getByRole("button"))

      const items = store.getState().cart.items
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({ id: 1, qty: 2 })
      expect(mockToastSuccess).toHaveBeenCalledWith(
        `Added ${mockProduct.name} from your cart`,
      )
    })
  })

  describe("when product is already in the cart", () => {
    it('shows "Update cart" as the button text', () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: cartStateWithItem,
      })
      expect(screen.getByRole("button")).toHaveTextContent("Update cart")
    })

    it("enables the button", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: cartStateWithItem,
      })
      expect(screen.getByRole("button")).not.toBeDisabled()
    })

    it("includes 0 as a selectable option", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: cartStateWithItem,
      })
      const optionValues = screen
        .getAllByRole("option")
        .map(o => o.getAttribute("value"))
      expect(optionValues).toContain("0")
    })

    it("shows 11 options (0 through 10)", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: cartStateWithItem,
      })
      expect(screen.getAllByRole("option")).toHaveLength(11)
    })

    it("reflects the current cart quantity as the selected value", () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: cartStateWithItem,
      })
      expect(screen.getByTestId("qty-select")).toHaveValue("2")
    })

    it("dispatches addUpdateCart and shows an update toast when changing qty", () => {
      const { store } = renderWithProviders(
        <QuantitySelect product={mockProduct} />,
        { preloadedState: cartStateWithItem },
      )
      fireEvent.change(screen.getByTestId("qty-select"), {
        target: { value: "5" },
      })
      fireEvent.click(screen.getByRole("button"))

      expect(store.getState().cart.items[0]).toMatchObject({ id: 1, qty: 5 })
      expect(mockToastSuccess).toHaveBeenCalledWith(
        `Updated ${mockProduct.name} quantity to 5`,
      )
    })

    it('changes button text to "Remove from cart" when qty 0 is selected', async () => {
      renderWithProviders(<QuantitySelect product={mockProduct} />, {
        preloadedState: cartStateWithItem,
      })
      fireEvent.change(screen.getByTestId("qty-select"), {
        target: { value: "0" },
      })
      expect(
        await screen.findByRole("button", { name: /remove from cart/i }),
      ).toBeInTheDocument()
    })

    it("dispatches removeFromCart and shows a remove toast when qty 0 is applied", async () => {
      const { store } = renderWithProviders(
        <QuantitySelect product={mockProduct} />,
        { preloadedState: cartStateWithItem },
      )
      fireEvent.change(screen.getByTestId("qty-select"), {
        target: { value: "0" },
      })
      const removeBtn = await screen.findByRole("button", {
        name: /remove from cart/i,
      })
      fireEvent.click(removeBtn)

      expect(store.getState().cart.items).toHaveLength(0)
      expect(mockToastSuccess).toHaveBeenCalledWith(
        `Removed ${mockProduct.name} from your cart`,
      )
    })
  })

  it("applies a custom className to the wrapper element", () => {
    const { container } = renderWithProviders(
      <QuantitySelect product={mockProduct} className="my-custom-class" />,
      { preloadedState: emptyCartState },
    )
    expect(container.firstChild).toHaveClass("my-custom-class")
  })
})
