import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import { UserDataProvider, useUserData } from "@/context/UserDataContext"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Test component
const TestComponent = () => {
  const { loading, error, data, setUserName } = useUserData()
  return (
    <div>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      <ul data-testid="users">
        {data.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <input
        data-testid="filter-input"
        onChange={e => setUserName(e.target.value)}
        placeholder="Filter by name"
      />
    </div>
  )
}

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    address: { street: "", suite: "", zipcode: "", geo: { lat: "", lng: "" } },
    phone: "",
    website: "",
    company: { name: "", catchPhrase: "", bs: "" },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    address: { street: "", suite: "", zipcode: "", geo: { lat: "", lng: "" } },
    phone: "",
    website: "",
    company: { name: "", catchPhrase: "", bs: "" },
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    address: { street: "", suite: "", zipcode: "", geo: { lat: "", lng: "" } },
    phone: "",
    website: "",
    company: { name: "", catchPhrase: "", bs: "" },
  },
]

describe("UserDataContext", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches and displays users", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockUsers,
    })

    render(
      <UserDataProvider>
        <TestComponent />
      </UserDataProvider>,
    )

    expect(screen.getByTestId("loading")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    })

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument()
  })

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    render(
      <UserDataProvider>
        <TestComponent />
      </UserDataProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Network error")
    })
  })

  it("filters users by name", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockUsers,
    })

    render(
      <UserDataProvider>
        <TestComponent />
      </UserDataProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const input = screen.getByTestId("filter-input")
    fireEvent.change(input, { target: { value: "Jane" } })

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument()
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument()
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument()
    })
  })

  it("throws error when useUserData is used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      "User Data Context is undefined",
    )

    consoleSpy.mockRestore()
  })
})
