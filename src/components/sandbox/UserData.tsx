import { useState, useEffect, useRef } from "react"
import { useUserData } from "@/context/UserDataContext"

const UserData = () => {
  const [name, setName] = useState<string>("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const { data, loading, error, setUserName } = useUserData()
  const currUserName = useRef<string>("")

  useEffect(() => {
    if (!isTyping && currUserName.current === name) {
      setUserName(name)
    }
  }, [name, setUserName, isTyping])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error... {error}</div>
  }

  const debounce = <T extends unknown[]>(
    func: (...args: T) => void,
    delay: number | undefined,
  ) => {
    let timeoutId: number | string | NodeJS.Timeout | undefined

    return (...args: T) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    currUserName.current = val
    setIsTyping(true)

    const doTypeDebounce = debounce(() => {
      setIsTyping(false)
    }, 700)

    doTypeDebounce()
  }

  return (
    <div>
      <div>
        <input
          style={{ border: "1px solid #c0c0c0" }}
          value={name}
          onChange={handleChange}
        />
      </div>
      <div>
        {!isTyping && !data.length && <div>No users found...</div>}
        {isTyping && <div>typing...</div>}
        {!isTyping &&
          data.map(user => {
            return <div key={Math.random()}>{user.name}</div>
          })}
      </div>
    </div>
  )
}

export default UserData
