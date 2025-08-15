import CartSummary from "./CartSummary"
import CheckoutBilling from "./CheckoutBilling"
import CheckoutShipping from "./CheckoutShipping"
import * as Accordion from "@radix-ui/react-accordion"
import '../../css/accordion.css'

const CheckoutForm = () => {  
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <Accordion.Root type="single" collapsible defaultValue="cart-summary" className="AccordionRoot">
        <Accordion.Item className="AccordionItem" value="cart-summary">
          <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger>
              <h2 className="text-lg font-bold text-gray-800 flex items-center py-5 cursor-pointer">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-medium mr-3">1</span>
                Shopping Cart Contents
              </h2>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="AccordionContent">
            <div className="p-4">
              <CartSummary isCheckout={true} />
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item className="AccordionItem" value="shipping">
          <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger>
              <h2 className="text-lg font-bold text-gray-800 flex items-center py-5 cursor-pointer">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-medium mr-3">2</span>
                Shipping Information
              </h2>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="AccordionContent">
            <CheckoutShipping />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item className="AccordionItem" value="billing">
          <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger>
              <h2 className="text-lg font-bold text-gray-800 flex items-center py-5 cursor-pointer">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-medium mr-3">3</span>
                Billing Information
              </h2>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="AccordionContent">
            <CheckoutBilling />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Complete Purchase
        </button>
      </div>
    </div>
  )
}

export default CheckoutForm