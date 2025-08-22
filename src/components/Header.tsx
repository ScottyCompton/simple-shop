import CartContents from "./ui/CartContents"
import UserDisplay from "./ui/UserDisplay"
import CategorySelect from "./ui/CategorySelect"
import { Link } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas, faSackDollar } from "@fortawesome/free-solid-svg-icons"
library.add(fas)

const Header = () => {
  return (
    <header className="w-full bg-blue-800 py-3 sm:py-5 px-4 sm:px-6 text-white mb-4 sm:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="mb-2 sm:mb-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold hover:text-blue-200 transition-colors"
          >
            <FontAwesomeIcon
              icon={faSackDollar}
              size="lg"
              className="sm:text-2xl"
            />
            <span>[Simple Shop]</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center">
            <span className="mr-2 text-xs">Explore</span>
            <CategorySelect />
          </div>
          <div>
            <UserDisplay />
          </div>
          <div>
            <CartContents />
          </div>
        </div>

        <div className="sm:hidden w-full mt-3">
          <div className="flex items-center justify-center">
            <span className="mr-2 text-xs">Explore</span>
            <CategorySelect />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
