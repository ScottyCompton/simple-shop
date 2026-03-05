/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react"

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
]

enum BTNTEXT {
  ADD = "Add New User",
  UPDATE = "Change User Name",
}

const SimpleEmployeeList = () => {
  const [userList, setUserList] = useState(users)
  const [userName, setUserName] = useState("")
  const [selectedUser, setSelectedUser] = useState("-1")
  const [btnText, setBtnText] = useState(BTNTEXT.ADD)
  const [reversed, setReversed] = useState(false)
  const [filterValue, setFilterValue] = useState("")

  const changeUserName = () => {
    if (selectedUser === "-1") {
      if (userName === "") return

      // add a new user to the array
      const newUser = {
        id: userList.length + 1,
        name: userName,
        email: `${userName.replace(/ /gi, "").toLowerCase()}@somedomain.com`,
      }
      setUserList(prev => {
        return [...prev, newUser]
      })
    } else {
      // update the name of the existing user
      setUserList(prev => {
        const out = structuredClone(prev)
        const idx = prev.findIndex(user => user.id === parseInt(selectedUser))
        const toUpdate = out[idx]
        toUpdate.name = userName
        const emailDomain = toUpdate.email.split("@")[1]
        toUpdate.email =
          userName.replace(" ", "").toLowerCase() + "@" + emailDomain
        out[idx] = { ...out[idx], ...toUpdate }
        return out
      })
    }

    setUserName("")
    setBtnText(BTNTEXT.ADD)
    setSelectedUser("-1")
  }

  const selectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value

    setBtnText(() => {
      return val === "-1" ? BTNTEXT.ADD : BTNTEXT.UPDATE
    })

    setSelectedUser(val)
  }

  const deleteUser = (id: number) => {
    setUserList(prev => {
      return prev.filter(user => user.id !== id)
    })
  }

  const doReverse = () => {
    setReversed(!reversed)
  }

  const sortedList = () => {
    const out = userList
      .filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
    return reversed ? out.reverse() : out
  }

  const setUserNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setUserName(val)
  }

  const applyFilterValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFilterValue(val)
  }

  return (
    <div>
      <div style={{ textAlign: "right" }}>
        Filter By Name:{" "}
        <input
          type="text"
          value={filterValue}
          onChange={applyFilterValue}
          style={{ border: "1px solid #000" }}
        />
      </div>
      <h2>
        User List{" "}
        <span
          style={
            reversed
              ? {
                  display: "inline-block",
                  transform: "rotate(180deg)",
                  cursor: "pointer",
                }
              : { cursor: "pointer" }
          }
          onClick={doReverse}
        >
          ^
        </span>
      </h2>
      <ul>
        {sortedList().map(user => (
          <li key={Math.random()}>
            <div>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => {
                  deleteUser(user.id)
                }}
              >
                X
              </button>{" "}
              {user.name} - {user.email}
            </div>
          </li>
        ))}
      </ul>
      <div>
        <p>&nbsp;</p>
      </div>
      <input
        style={{ border: "1px solid black", margin: "5px" }}
        type="text"
        value={userName}
        onChange={setUserNameValue}
      />
      <select value={selectedUser} onChange={selectUser}>
        <option value="-1">Select User</option>
        {sortedList().map(user => {
          return (
            <option key={Math.random()} value={user.id}>
              {user.name}
            </option>
          )
        })}
      </select>
      <button
        style={{
          backgroundColor: "blue",
          margin: "5px",
          color: "white",
          padding: "7px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={changeUserName}
      >
        {btnText}
      </button>
    </div>
  )
}

export default SimpleEmployeeList
