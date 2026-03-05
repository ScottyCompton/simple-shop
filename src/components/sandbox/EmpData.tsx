/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react"
import { useEmployeeData } from "@/context/EmpDataContext"
import "../../css/sandbox.css"

const EmpData = () => {
  const { loading, data, error, setEndpoint } = useEmployeeData()
  const [empName, setEmpName] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const currEndpoint = useRef("")

  useEffect(() => {
    if (!isTyping && empName === currEndpoint.current) {
      setEndpoint(empName)
    }
  }, [empName, setEndpoint, isTyping])

  const debounce = <T extends any[]>(
    func: (...args: T) => void,
    delay: number | undefined,
  ) => {
    let timeoutId: string | number | NodeJS.Timeout | undefined

    return (...args: T) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleChangeEmpName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmpName(val)
    currEndpoint.current = val
    setIsTyping(true)

    const doSetEndpoint = debounce(() => {
      setIsTyping(false)
    }, 1500)

    doSetEndpoint()
  }

  return (
    <>
      <div>
        <label htmlFor="empname">Employee Name</label>
        <input
          type="text"
          id="empname"
          onChange={handleChangeEmpName}
          value={empName}
          style={{ border: "1px solid #c0c0c0", margin: "15px" }}
        />
        {(loading || isTyping) && <span>typing...</span>}
      </div>
      <div>
        <p>&nbsp;</p>
      </div>
      <div>
        {error && <div>There was an error... {error}</div>}

        {!isTyping &&
          data.map(item => {
            return (
              <div key={Math.random()} className="empdatarow">
                <div>{item.name}</div>
                <div>{item.gender}</div>
                <div>{item.email}</div>
                <div>{item.phone_number}</div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default EmpData
