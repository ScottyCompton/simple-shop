import { Flex } from "@radix-ui/themes"
import HomeCats from "../components/shop/HomeCats"

const Home = () => {
  return (
    <>
    <Flex className="w-full flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to [Pointless]</h1>
      <p className="mb-8 text-center">The #1 place on the internet to buy stuff you don't need.<br /><b/> Explore product categories below:</p>
     </Flex>
    <div><HomeCats /></div>
    </>
  )
}

export default Home