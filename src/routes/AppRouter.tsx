import {
  Home,
  Cart,
  Shop,
  ProductDetails,
  Checkout,
  Login,
  AuthCallback,
  Profile,
} from "../page/"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "@/components/Layout"
import Sandbox from "@/page/Sandbox"

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/shop">
            <Route index element={<Shop />} />
            <Route path="products/:productId" element={<ProductDetails />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter
