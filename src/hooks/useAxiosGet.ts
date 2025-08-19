import { useState, useEffect } from "react"
import axios from "axios"
import type { AxiosError } from "axios"
import type {
  FetchData,
  UseFetchDataHookResult,
  FetchDataResult,
} from "@/types"

export enum FETCHTYPE {
  SHIPPING = "/shippingtypes",
  STATES = "/states",
}

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

export const useAxiosGet = (fetchType: FETCHTYPE): UseFetchDataHookResult => {
  const [data, setData] = useState<FetchData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState<string>("")

  const baseUrl = import.meta.env.VITE_API_URL as string
  useEffect(() => {
    setApiUrl(`${baseUrl}${fetchType}`)

    const fetchData = async () => {
      await axios
        .get(apiUrl)
        .then(response => {
          const { result } = response.data as FetchDataResult
          setData(result)
        })
        .catch(
          axiosErrorHandler<FetchDataResult>(res => {
            if (res.type === "axios-error") {
              setError(res.error.message || "")
            } else {
              setError("An unexpected error occurred.")
            }
          }),
        )
        .finally(() => {
          setLoading(false)
        })
    }
    void fetchData()
  }, [apiUrl, baseUrl, fetchType])

  return { data, loading, error, apiUrl }
}
