import { Select } from "@radix-ui/themes"
import { useAxiosGet } from "@/hooks/useAxiosGet"
import "@/css/stateselect.css"
import { useState } from "react"

type StateSelectProps = {
  value?: string
  onChange?: (value: string) => void
  name?: string
}

const StateSelect: React.FC<StateSelectProps> = ({
  value,
  onChange,
  name,
}: StateSelectProps) => {
  const [selectedState, setSelectedState] = useState(value ?? "")
  const { data: states, isError, isLoading } = useAxiosGet("states")

  if (isLoading) {
    return (
      <div className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm bg-gray-50 text-gray-500 text-sm">
        Loading states...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full rounded-md border border-red-300 px-3 py-2 shadow-sm bg-red-50 text-red-500 text-sm">
        Error loading states
      </div>
    )
  }

  const handleValueChange = (val: string) => {
    setSelectedState(val)
    if (onChange) {
      onChange(val)
    }

    // Create and dispatch a custom change event for react-hook-form
    if (name) {
      const event = new CustomEvent("stateSelect", {
        bubbles: true,
        detail: { name, value: val },
      })
      document.dispatchEvent(event)
    }
  }

  return (
    <div className="select-in-dialog w-full" id="state-select-container">
      <input type="hidden" name={name} value={selectedState} />
      <Select.Root
        size="2"
        defaultValue={value}
        value={selectedState}
        onValueChange={handleValueChange}
      >
        <Select.Trigger
          placeholder="Select a state"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between bg-white h-[38px]"
          style={{
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            appearance: "none",
          }}
        >
          {selectedState ? (
            <span>
              {states?.find(s => s.abbr === selectedState)?.state ??
                selectedState}
            </span>
          ) : (
            <span className="text-gray-400">Select a state</span>
          )}
        </Select.Trigger>
        <Select.Content
          position="popper"
          aria-describedby={undefined}
          sideOffset={5}
          align="start"
          avoidCollisions
          style={{ zIndex: 2500 }}
        >
          <Select.Group>
            <Select.Label className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
              State
            </Select.Label>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {states?.map(state => (
                <Select.Item
                  key={state.abbr}
                  value={state.abbr}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {state.state}
                </Select.Item>
              ))}
            </div>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  )
}

export default StateSelect
