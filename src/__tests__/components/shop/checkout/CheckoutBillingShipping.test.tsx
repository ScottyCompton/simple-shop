import { screen, waitFor, act } from "@testing-library/react"
import { vi } from "vitest"
import axios from "axios"
import CheckoutBillingShipping from "../../../../components/shop/checkout/CheckoutBillingShipping"
import { renderWithProviders } from "../../../testUtils"
import type { UserBilling, UserShipping, User } from "../../../../types"

vi.mock("axios")
const mockedAxios = vi.mocked(axios)

vi.mock("../../../../components/shop/checkout/components/BillShipBox", () => ({
  default: ({ type, data }: { type: string; data?: object | null }) => (
    <div data-testid={`bill-ship-box-${type}`}>
      {data ? `${type}-has-data` : `${type}-no-data`}
    </div>
  ),
}))

const mockUser: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  hasBilling: true,
  hasShipping: true,
  lastUpdate: "2024-01-01",
}

const mockBilling: UserBilling = {
  firstName: "John",
  lastName: "Doe",
  address1: "123 Main St",
  city: "Springfield",
  state: "IL",
  zip: "62701",
  phone: "555-1234",
}

const mockShipping: UserShipping = {
  firstName: "Jane",
  lastName: "Doe",
  address1: "456 Elm St",
  city: "Springfield",
  state: "IL",
  zip: "62702",
  phone: "555-5678",
  useAsBilling: false,
}

const makeApiResponse = (overrides: Record<string, unknown> = {}) => ({
  data: {
    data: {
      user: {
        ...mockUser,
        billing: mockBilling,
        shipping: mockShipping,
        billingLastUpdate: "2024-01-01",
        shippingLastUpdate: "2024-01-01",
        ...overrides,
      },
    },
  },
})

describe("CheckoutBillingShipping", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows loading state while fetching user data", () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}))

    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows an error when the API request fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"))

    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    await waitFor(() => {
      expect(screen.getByText("Error: Network Error")).toBeInTheDocument()
    })
  })

  it("shows an error when user data is not found in the response", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: { user: null } },
    })

    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    await waitFor(() => {
      expect(
        screen.getByText("Error: User data not found in server response"),
      ).toBeInTheDocument()
    })
  })

  it("shows an error when billing or shipping data is missing", async () => {
    mockedAxios.get.mockResolvedValue(
      makeApiResponse({ billing: null, shipping: null }),
    )

    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    await waitFor(() => {
      expect(
        screen.getByText(
          "Error: Billing or shipping data not found in server response",
        ),
      ).toBeInTheDocument()
    })
  })

  it("renders billing and shipping boxes with data on successful fetch", async () => {
    mockedAxios.get.mockResolvedValue(makeApiResponse())

    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    await waitFor(() => {
      expect(screen.getByTestId("bill-ship-box-billing")).toBeInTheDocument()
    })

    expect(screen.getByTestId("bill-ship-box-billing")).toHaveTextContent(
      "billing-has-data",
    )
    expect(screen.getByTestId("bill-ship-box-shipping")).toHaveTextContent(
      "shipping-has-data",
    )
  })

  it("does not fetch data when no user is logged in", async () => {
    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: null } },
    })

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    expect(mockedAxios.get).not.toHaveBeenCalled()
    expect(screen.getByTestId("bill-ship-box-billing")).toBeInTheDocument()
    expect(screen.getByTestId("bill-ship-box-shipping")).toBeInTheDocument()
  })

  it("calls the correct API endpoint for the logged-in user", async () => {
    mockedAxios.get.mockResolvedValue(makeApiResponse())

    renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/users/1"),
      )
    })
  })

  it("re-fetches data when lastUpdate changes in the store", async () => {
    mockedAxios.get.mockResolvedValue(makeApiResponse())

    const { store } = renderWithProviders(<CheckoutBillingShipping />, {
      preloadedState: { user: { user: mockUser } },
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    })

    // Trigger a lastUpdate change by dispatching a billing update
    const { setUserHasBilling } = await import(
      "../../../../features/shop/usersSlice"
    )
    act(() => {
      store.dispatch(setUserHasBilling(false))
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    })
  })
})
