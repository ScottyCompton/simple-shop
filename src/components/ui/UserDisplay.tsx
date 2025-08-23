import { Link } from "react-router-dom"
import { useAppSelector } from "@/app/hooks"
import { selectUser } from "@/features/shop/usersSlice"
import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faChevronDown,
  faSignOutAlt,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons"

const UserDisplay = () => {
  const user = useAppSelector(selectUser)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Remove auth token
    localStorage.removeItem("authToken")
    // Force page refresh to update auth state
    window.location.href = "/"
  }

  if (!user) {
    return (
      <div>
        <Link
          to="/login"
          className="text-xs flex items-center hover:text-blue-200 transition-colors"
        >
          <FontAwesomeIcon icon={faUser} className="mr-1" />
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-xs flex items-center hover:text-blue-200 transition-colors"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {!user.avatar && (
          <>
            <FontAwesomeIcon icon={faUser} className="mr-1" />
            {user.firstName}
          </>
        )}
        {user.avatar && (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-6 h-6 rounded-full object-cover mr-1"
          />
        )}
        <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <FontAwesomeIcon icon={faUserCog} className="mr-2" />
              Profile & Settings
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDisplay
