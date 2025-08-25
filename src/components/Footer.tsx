const Footer = () => {
  return (
    <footer
      className="w-full py-4 px-4 sm:px-6 text-white"
      style={{
        backgroundColor: "var(--color-secondary)",
        boxShadow: "0 -1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Simple Shop
        </div>
        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:opacity-80 transition-opacity">
            Privacy Policy
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            Terms of Service
          </a>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
