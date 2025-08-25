import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--color-page-background)" }}
    >
      <div
        className="max-w-7xl w-full mx-auto flex-1 flex flex-col content-container"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Header />
        <main
          className="flex-1 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8"
          style={{ color: "var(--color-text)" }}
          id="main-content"
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
