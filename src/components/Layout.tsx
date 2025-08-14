import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        <Header />
        <main className="flex-1 py-4 sm:py-6 lg:py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout