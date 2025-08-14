import {Home, Cart, Shop, ProductDetails} from '../page/'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout'
import Checkout from '../page/Checkout';

const AppRouter = () => {
  return (
    <Router>
              <Routes>
                  <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="/shop">
                          <Route index element={<Shop />} />
                          <Route path="products/:productId" element={<ProductDetails />} />
                      </Route>
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      {/* <Route path="/product" element={<ProductDetails />} /> */}
                  </Route>
              </Routes>
            </Router>
  )
}

export default AppRouter