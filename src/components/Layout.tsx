import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
const Layout = () => {
  return (
    <div className="max-w-6xl m-auto">
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Layout