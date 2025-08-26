import { useData } from "@/context/DataContext"
import { useState, useEffect } from "react"

const Sandbox = () => {
  const [selected, setSelected] = useState("")
  const { data, loading, error } = useData()
  const [products, setProducts] = useState(data)
  // if (loading) {
  //   return <div>Loading data...</div>
  // }

  // if (error) {
  //   return <div>Error loading provider data</div>
  // }

  useEffect(() => {
    setProducts(data)
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const result = data.filter(item => item.category === val)
    setProducts(result)
    setSelected(val)
  }

  return (
    <>
      <div>
        <select name="endpont" onChange={handleChange} value={selected}>
          <option value="">All Items</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Wearables">Wearables</option>
          <option value="Storage">Storage</option>
          <option value="Smart Home">Smart Home</option>
          <option value="Transportation">Transportation</option>
        </select>
      </div>
      <div>
        {loading && <div>Loading data...</div>}
        {error && <div>Error loading data: {error}</div>}
        {products.map(product => (
          <div>{product.name}</div>
        ))}
      </div>
    </>
  )
}

export default Sandbox
