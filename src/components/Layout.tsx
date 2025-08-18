import Header from "./Header/Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectUser, setUser } from "@/features/shop/usersSlice"
import type { User } from "@/types"

const Layout = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectUser) !== null

  if (!isLoggedIn) {
    const localUserData: User | null = JSON.parse(
      localStorage.getItem("user") ?? "null",
    ) as User | null
    if (localUserData) {
      dispatch(setUser(localUserData))
    }
  }

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
