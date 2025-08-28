import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react"

export type ProductData = {
  id: number
  name: string
  price: number
  category: string
}

type ResponseData = {
  data: {
    products: ProductData[]
  }
}

type DataContextType = {
  products: ProductData[]
  loading: boolean
  error: string | null
  setCat: (cat: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)
const ROOT_ENDPOINT = `${import.meta.env.VITE_API_URL as string}/products/`

export const ProductDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductData[] | []>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [cat, setCat] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = cat ? `${ROOT_ENDPOINT}/category/${cat}` : ROOT_ENDPOINT
      try {
        // load the data`
        await fetch(endpoint)
          .then(res => res.json())
          .then(resData => {
            const { data } = resData as ResponseData
            setProducts(data.products)
          })
      } catch (error) {
        setProducts([])
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
  }, [cat])

  return (
    <DataContext.Provider value={{ products, loading, error, setCat }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
