
import { Flex } from "@radix-ui/themes"

const Footer = () => {
  return (
    <footer className="w-full bg-blue-800 py-4 px-2 text-white mt-8">
      <Flex justify="between">
        <div>© {new Date().getFullYear()} Simple Shop</div>
        <div>All rights reserved</div>
      </Flex>
    </footer>
  )
}

export default Footer