import { Link } from "react-router"
import { useAppSelector } from "../../app/hooks"
import {selectUser} from '../../features/shop/usersSlice'

const UserDisplay = () => {
  const user = useAppSelector(selectUser)

  if(!user) {
    return (
        <div><Link to="/login" className="text-xs">Login</Link></div>
    )
  }


  return (
    <div className="text-xs">welcome back, {user.firstName}</div>
  )
}

export default UserDisplay