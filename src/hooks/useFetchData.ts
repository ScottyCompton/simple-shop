import { useState, useEffect } from "react"
import type {
  FetchData,
  UseFetchDataHookResult,
  FetchDataResult,
} from "@/types"

export enum FETCHTYPE {
  SHIPPING = "/shippingtypes",
  STATES = "/states",
}

export const useFetchData = (fetchType: FETCHTYPE): UseFetchDataHookResult => {
  const [data, setData] = useState<FetchData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState<string | null>(null)

  const baseUrl = import.meta.env.VITE_API_URL as string
  useEffect(() => {
    setApiUrl(`${baseUrl}${fetchType}`)

    const fetchData = async () => {
      try {
        console.log(`Fetching from: ${baseUrl}${fetchType}`)
        const response = await fetch(`${baseUrl}${fetchType}`)

        if (!response.ok) {
          throw new Error(
            `HTTP Error (useFetchData): ${response.status.toString()}`,
          )
        }
        const { result } = (await response.json()) as FetchDataResult
        setData(result)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(error as string)
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [baseUrl, fetchType])

  return { data, loading, error, apiUrl }
}
