import { useState, useEffect, useContext, createContext } from "react"

// Employee interface based on the provided JSON structure
export type Employee = {
  "Unnamed: 0": number
  employee_id: number
  name: string
  gender: string
  dates_of_birth: string
  email: string
  phone_number: string
  address: string
  department: string
  job_titles: string
  manager_id: number
  hire_date: string
  salary: number
  employment_status: string
  employee_type: string
  education_level: string
  certifications: string
  skills: string
  performance_ratings: number
  work_experience: string
  benefits_enrollment: string
  city: string
  work_hours: string
  employee_status: string
  emergency_contacts: string
}

type EmployeeDataContextType = {
  loading: boolean
  error: string | null
  data: Employee[]
  endpoint: string
  setEndpoint: (endpoint: string) => void
}

type RespData = {
  data: Employee[]
}

const EmpDataContext = createContext<EmployeeDataContextType | undefined>(
  undefined,
)

export const EmpDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Employee[]>([])
  const [endpoint, setEndpoint] = useState<string>("")
  const root = "http://localhost:3000/api/employees/search/?lastname="

  useEffect(() => {
    const fetchData = async () => {
      // prevent extremely long lists being returned for short query values
      if (endpoint.length < 3) {
        setData([])
        return
      }

      try {
        await fetch(`${root}${endpoint}`)
          .then(res => res.json())
          .then(empData => {
            const { data } = empData as RespData
            setData(data)
          })
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(error as string)
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [endpoint])

  return (
    <EmpDataContext.Provider
      value={{ loading, error, data, endpoint, setEndpoint }}
    >
      {children}
    </EmpDataContext.Provider>
  )
}

export const useEmployeeData = () => {
  const context = useContext(EmpDataContext)
  if (context === undefined) {
    throw new Error("Employee Data Context must be used")
  }
  return context
}
