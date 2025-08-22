import { useState, useEffect } from "react"
import axios from "axios"
import type { AxiosError } from "axios"
import type {
  EndpointKeys,
  EndpointDataMap,
  ApiResponseStructure,
} from "@/types"

type IErrorBase<T> = {
  error: Error | AxiosError<T>
  type: "axios-error" | "stock-error"
}

type IAxiosError<T> = IErrorBase<T> & {
  error: AxiosError<T>
  type: "axios-error"
}
type IStockError<T> = IErrorBase<T> & {
  error: Error
  type: "stock-error"
}

export function axiosErrorHandler<T>(
  callback: (err: IAxiosError<T> | IStockError<T>) => void,
) {
  return (error: Error | AxiosError<T>) => {
    if (axios.isAxiosError(error)) {
      callback({
        error: error,
        type: "axios-error",
      })
    } else {
      callback({
        error: error,
        type: "stock-error",
      })
    }
  }
}

export function useAxiosGet<T extends EndpointKeys>(fetchType: T) {
  type ResultType = EndpointDataMap[T]

  const [data, setData] = useState<ResultType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<string | null>(null)

  const apiUrl = `${import.meta.env.VITE_API_URL as string}/${fetchType}`

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(apiUrl)
        .then(response => {
          // Get the response data with type safety
          const responseBody = response.data as ApiResponseStructure

          if (responseBody.data) {
            // Extract the data property name and value dynamically
            const entries = Object.entries(responseBody.data)

            // Find the first array in the response data
            for (const [, value] of entries) {
              if (Array.isArray(value)) {
                setData(value as ResultType)
                break
              }
            }
          }
        })
        .catch(
          axiosErrorHandler<unknown>(res => {
            if (res.type === "axios-error") {
              setIsError(res.error.message || "")
            } else {
              setIsError("An unexpected error occurred.")
            }
          }),
        )
        .finally(() => {
          setIsLoading(false)
        })
    }
    void fetchData()
  }, [apiUrl, fetchType])

  return { data, isLoading, isError, apiUrl }
}
