import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// library.add(fas, far, fab)
library.add(fas)
import { cartCount } from '../../features/shop/cartSlice'
import { useAppSelector } from '../../app/hooks'
import { Link } from 'react-router-dom'


const CartContents = () => {

    const count = useAppSelector(cartCount)

  return (
    <div> <Link to="/cart"><FontAwesomeIcon icon={faShoppingCart} />{count} items</Link></div>
  )
}

export default CartContents