import { useState, useEffect, createContext, useContext } from "react"

type UserData = {
  id: number
  name: string
  email: string
  address: {
    street: string
    suite: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

type UserDataContextProps = {
  loading: boolean
  error: string | null
  data: UserData[]
  setUserName: (userName: string) => void
}

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined,
)

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [localData, setLocalData] = useState<UserData[] | []>([])
  const [filteredData, setFilteredData] = useState<UserData[]>([])
  const [userName, setUserName] = useState<string>("")
  const url = "https://jsonplaceholder.typicode.com/users"

  // **************************************************************
  // this method calls the API data once, then returns a filtered
  // result when the userName changes - hence, only one API call
  // **************************************************************

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const respData = await fetch(url)
        const jsonData = (await respData.json()) as UserData[]
        setLocalData(() => jsonData)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Something horrible occurred...")
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchUserData()
  }, [])

  useEffect(() => {
    setFilteredData(() => {
      return localData.filter(user =>
        user.name
          .toLowerCase()
          .includes(userName.replace(" ", "").toLowerCase()),
      )
    })
  }, [userName, localData])

  // **************************************************************
  // this method calls the API every time the userName changes,
  // then returns the filtered result.
  // ***************************************************************

  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       try {
  //         const respData = await fetch(url)
  //         const jsonData = (await respData.json()) as UserData[]
  //         setData(() => {
  //           return userName === ""
  //             ? jsonData
  //             : jsonData.filter(user =>
  //                 user.name.toLowerCase().includes(userName.toLowerCase()),
  //               )
  //         })

  //         // await fetch(url)
  //         //   .then(resp => resp.json())
  //         //   .then(jsonData => {
  //         //     setData(() => {
  //         //       return userName === ""
  //         //         ? (jsonData as UserData[])
  //         //         : (jsonData as UserData[]).filter(user =>
  //         //             user.name.toLowerCase().includes(userName.toLowerCase()),
  //         //           )
  //         //     })
  //         //   })
  //       } catch (error: unknown) {
  //         if (error instanceof Error) {
  //           setError(error.message)
  //         }
  //       } finally {
  //         setLoading(false)
  //       }
  //     }

  //     void fetchUserData()
  //   }, [userName])

  return (
    <UserDataContext.Provider
      value={{ loading, error, data: filteredData, setUserName }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error("User Data Context is undefined")
  }
  return context
}
