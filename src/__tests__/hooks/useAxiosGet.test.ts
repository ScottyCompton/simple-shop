import { renderHook, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import axios from "axios"
import { useAxiosGet } from "@/hooks/useAxiosGet"

// Mock axios
vi.mock("axios")
const mockedAxios = vi.mocked(axios)

describe("useAxiosGet", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("VITE_API_URL", "https://api.example.com")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("fetches data successfully", async () => {
    const mockData = [{ id: 1, name: "Test Item" }]
    const mockResponse = {
      data: {
        data: {
          items: mockData,
        },
      },
    }

    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAxiosGet("products"))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.isError).toBe(null)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.isError).toBe(null)
    expect(result.current.apiUrl).toBe("https://api.example.com/products")
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.example.com/products",
    )
  })

  it("handles axios error", async () => {
    const mockError = new Error("Network Error")
    mockedAxios.get.mockRejectedValueOnce(mockError)
    mockedAxios.isAxiosError.mockReturnValueOnce(true)

    const { result } = renderHook(() => useAxiosGet("products"))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.isError).toBe("Network Error")
  })

  it("handles non-axios error", async () => {
    const mockError = new Error("Unexpected Error")
    mockedAxios.get.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useAxiosGet("products"))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.isError).toBe("An unexpected error occurred.")
  })

  it("handles response without array data", async () => {
    const mockResponse = {
      data: {
        data: {
          message: "No data",
        },
      },
    }

    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAxiosGet("products"))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.isError).toBe(null)
  })
})
