import CartSummary from "./CartSummary"
import CheckoutBilling from "./CheckoutBilling"
import CheckoutShipping from "./CheckoutShipping"

const CheckoutForm = () => {
  return (
    <>
        <div><CartSummary isCheckout={true} /></div>
        <div><CheckoutShipping /></div>
        <div><CheckoutBilling /></div>
    </>
  )
}

export default CheckoutForm