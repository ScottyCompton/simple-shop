import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import { EmpDataProvider, useEmployeeData } from "@/context/EmpDataContext"
import type { Employee } from "@/context/EmpDataContext"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Test component
const TestComponent = () => {
  const { loading, error, data, setEndpoint } = useEmployeeData()
  return (
    <div>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      <ul data-testid="employees">
        {data.map(emp => (
          <li key={emp.employee_id}>{emp.name}</li>
        ))}
      </ul>
      <input
        data-testid="endpoint-input"
        onChange={e => setEndpoint(e.target.value)}
        placeholder="Search lastname"
      />
    </div>
  )
}

const mockEmployees: Employee[] = [
  {
    "Unnamed: 0": 1,
    employee_id: 1,
    name: "John Doe",
    gender: "M",
    dates_of_birth: "",
    email: "",
    phone_number: "",
    address: "",
    department: "",
    job_titles: "",
    manager_id: 0,
    hire_date: "",
    salary: 50000,
    employment_status: "",
    employee_type: "",
    education_level: "",
    certifications: "",
    skills: "",
    performance_ratings: 0,
    work_experience: "",
    benefits_enrollment: "",
    city: "",
    work_hours: "",
    employee_status: "",
    emergency_contacts: "",
  },
  {
    "Unnamed: 0": 2,
    employee_id: 2,
    name: "Jane Smith",
    gender: "F",
    dates_of_birth: "",
    email: "",
    phone_number: "",
    address: "",
    department: "",
    job_titles: "",
    manager_id: 0,
    hire_date: "",
    salary: 60000,
    employment_status: "",
    employee_type: "",
    education_level: "",
    certifications: "",
    skills: "",
    performance_ratings: 0,
    work_experience: "",
    benefits_enrollment: "",
    city: "",
    work_hours: "",
    employee_status: "",
    emergency_contacts: "",
  },
]

describe("EmpDataContext", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not fetch when endpoint length < 3", () => {
    render(
      <EmpDataProvider>
        <TestComponent />
      </EmpDataProvider>,
    )

    const input = screen.getByTestId("endpoint-input")
    fireEvent.change(input, { target: { value: "Jo" } })

    expect(mockFetch).not.toHaveBeenCalled()
    expect(screen.getByTestId("employees")).toBeEmptyDOMElement()
  })

  it("fetches employees when endpoint length >= 3", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ data: mockEmployees }),
    })

    render(
      <EmpDataProvider>
        <TestComponent />
      </EmpDataProvider>,
    )

    const input = screen.getByTestId("endpoint-input")
    fireEvent.change(input, { target: { value: "Doe" } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/employees/search/?lastname=Doe",
      )
    })

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Jane Smith")).toBeInTheDocument()
  })

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Fetch failed"))

    render(
      <EmpDataProvider>
        <TestComponent />
      </EmpDataProvider>,
    )

    const input = screen.getByTestId("endpoint-input")
    fireEvent.change(input, { target: { value: "Smith" } })

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Fetch failed")
    })
  })

  it("throws error when useEmployeeData is used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      "Employee Data Context must be used",
    )

    consoleSpy.mockRestore()
  })
})
