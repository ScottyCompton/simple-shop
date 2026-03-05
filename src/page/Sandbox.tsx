// import { EmpDataProvider } from "@/context/EmpDataContext"
// import EmpData from "@/components/sandbox/EmpData"

// import { UserDataProvider } from "@/context/UserDataContext"
// import UserData from "@/components/sandbox/UserData"

// import { setUser } from "@/features/shop/usersSlice"
import { useState, useEffect } from "react"

type User = {
  id?: number
  name: string
  age?: number | string
  city: string
  email: string
}

const users = [
  { name: "Alice", age: 25, city: "New York", email: "alice@somedomain.com" },
  { name: "Bob", age: 30, city: "San Francisco", email: "bob@somedomain.com" },
  { name: "Chuck", age: 35, city: "Dallas", email: "chuck@somedomain.com" },
  { name: "David", age: 28, city: "Chicago", email: "david@somedomain.com" },
  { name: "Eve", age: 22, city: "Miami", email: "eve@somedomain.com" },
]

const newUser = { name: "", age: "", city: "", email: "" } as User

const Sandbox = () => {
  const [userArray, setUserArray] = useState<User[]>(users)
  const [userData, setUserData] = useState<User>(newUser)

  useEffect(() => {
    setUserArray(prev => {
      return prev.map(user => ({
        ...user,
        id: Math.floor(Math.random() * 1000000),
      }))
    })
  }, [])

  const doDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(e.currentTarget.textContent)
    setUserArray(prev => prev.filter(user => user.id !== id))
  }

  const addUser = () => {
    setUserArray(prev => {
      return [...prev, { ...userData, id: Math.floor(Math.random() * 1000000) }]
    })
    setUserData(newUser)
  }

  const updateUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id: name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <h1>Sandbox </h1>
      <div>
        Add New User:
        <form name="frm0" id="frm0">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={userData.name}
            onChange={updateUserData}
          />
          <input
            type="number"
            id="age"
            placeholder="Age"
            value={userData.age}
            onChange={updateUserData}
          />
          <input
            type="text"
            id="city"
            placeholder="City"
            value={userData.city}
            onChange={updateUserData}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={userData.email}
            onChange={updateUserData}
          />
          <button type="button" onClick={addUser}>
            Add User
          </button>
        </form>
      </div>
      {userArray.map(user => {
        return (
          <div key={user.id}>
            <p>
              {user.name} ({user.age}) - {user.city} - {user.email} - ID:{" "}
              <button onClick={doDelete}>{user.id}</button>
            </p>
          </div>
        )
      })}
    </>
    // <UserDataProvider>
    //   <UserData />
    // </UserDataProvider>
    // <EmpDataProvider>
    //   <EmpData />
    // </EmpDataProvider>
  )
}

export default Sandbox
