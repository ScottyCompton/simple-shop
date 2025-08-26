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
  data: ProductData[]
  loading: boolean
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const ROOT_ENDPOINT = `${import.meta.env.VITE_API_URL as string}/products/`

export const ProductDataProvider = ({ children }: { children: ReactNode }) => {
  //   const [products, setProducts] = useState<ProductData[] | []>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  //   const [cat, setCat] = useState<string>("")
  const [data, setData] = useState<ProductData[] | []>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // load the data`
        await fetch(ROOT_ENDPOINT)
          .then(res => res.json())
          .then(resData => {
            const { data } = resData as ResponseData
            setData(data.products)
          })
      } catch (error) {
        setData([])
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
  }, [])

  //   useEffect(() => {
  //     const filteredData = products.filter(item => {
  //       return (item.category = cat)
  //     })
  //     setData(filteredData)
  //   }, [cat, products])

  return (
    <DataContext.Provider value={{ data, loading, error }}>
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
