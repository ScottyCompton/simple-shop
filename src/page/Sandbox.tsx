import { useData } from "@/context/DataContext"
import { useState } from "react"

const Sandbox = () => {
  const [selected, setSelected] = useState("")
  const { products, loading, error, setCat } = useData()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelected(val)
    setCat(val)
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
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </>
  )
}

export default Sandbox
