import { StateSelect } from "@/components/ui"
import ShippingSelect from "@/components/ui/ShippingSelect"

const Sandbox = () => {
  return (
    <div>
      <ShippingSelect
        onSelectShippingType={type => {
          console.log(type)
        }}
      />
      <StateSelect
        value="CA"
        onChange={state => {
          console.log(state)
        }}
      />
    </div>
  )
}

export default Sandbox
