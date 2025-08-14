
const Footer = () => {
  return (
    <footer className="w-full bg-blue-800 py-4 px-4 sm:px-6 text-white mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="mb-2 sm:mb-0">© {new Date().getFullYear()} Simple Shop</div>
        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:text-blue-200 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Terms of Service</a>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer