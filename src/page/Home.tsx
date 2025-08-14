import { Flex } from "@radix-ui/themes"
import HomeCats from "../components/shop/HomeCats"

const Home = () => {
  return (
    <>
    <Flex className="w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 mt-6 text-center">Welcome to [Simple Shop]</h1>
      <p className="mb-8 text-center text-sm sm:text-base">
        The #1 place on the internet to buy stuff you don't need.
        <br />
        <span className="font-medium">Explore our vast inventory below!</span>
      </p>
     </Flex>
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <HomeCats />
    </div>
    </>
  )
}

export default Home