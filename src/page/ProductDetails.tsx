import ProductDetail from "../components/shop/ProductDetail"
import { useLocation } from "react-router"


const ProductDetails = () => {
  const location = useLocation()
  const currPath = location.pathname
  const id = currPath.split('/').pop()

  return (
    <div className="w-full max-w-full">
      {id && <ProductDetail id={parseInt(id)} />}
    </div>
  )
}

export default ProductDetails