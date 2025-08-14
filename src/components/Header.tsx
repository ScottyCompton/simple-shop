import { Flex } from "@radix-ui/themes"
import CartContents from './shop/CartContents'
import CategorySelect from './shop/CategorySelect'
import { Link } from "react-router"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faSackDollar } from '@fortawesome/free-solid-svg-icons'
library.add(fas)


const Header = () => {
  return (
    <Flex className="w-full bg-blue-800 py-5 px-2 text-white mb-8" justify="between">
     <div><Link to="/"><FontAwesomeIcon icon={faSackDollar} size="2xl" />[Pointless]</Link></div>
     <div className="flex align-middle">Explore &nbsp; <CategorySelect /></div>
     <div>
        <CartContents />
     </div>
     </Flex>
  )
}

export default Header