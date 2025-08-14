import ProductDetail from "../components/shop/ProductDetail"
import { useLocation } from "react-router"


const ProductDetails = () => {
  const location = useLocation()
  const currPath = location.pathname
  const id = currPath.split('/').pop()

  return (
    <div>{id && <ProductDetail id={parseInt(id)} />}</div>
  )
}

export default ProductDetails