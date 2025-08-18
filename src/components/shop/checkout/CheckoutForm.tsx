import CartSummary from "../cart/CartSummary"
import CheckoutBillingShipping from "./CheckoutBillingShipping"
import * as Accordion from "@radix-ui/react-accordion"
import "../../../css/accordion.css"
import { useState } from "react"
import { Button, Flex } from "@radix-ui/themes"
import CheckoutPayment from "./CheckoutPayment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router"

const CheckoutForm = () => {
  const [activeAccordion, setActiveAccordion] = useState<string>("checkout-1")
  const navigate = useNavigate()

  const handleAccordionToggle = (value: string) => {
    setActiveAccordion(value)
  }

  const handleBackClick = () => {
    void navigate(-1)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <Accordion.Root
        type="single"
        value={activeAccordion}
        onValueChange={handleAccordionToggle}
        collapsible
        defaultValue="checkout-1"
        className="AccordionRoot"
      >
        <Accordion.Item className="AccordionItem" value="checkout-1">
          <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger>
              <h2 className="text-lg font-bold text-gray-800 flex items-center py-5 cursor-pointer">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-medium mr-3">
                  1
                </span>
                Shopping Cart Contents
              </h2>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="AccordionContent">
            <div className="p-4">
              <CartSummary isCheckout={true} />
            </div>
            <div className="px-4 w-full">
              <Flex className="justify-between w-full mt-4">
                <div className="grow">
                  <Button size="1" onClick={handleBackClick}>
                    <span className="cursor-pointer">
                      <FontAwesomeIcon icon={faArrowLeft} size="sm" /> Continue
                      Shopping
                    </span>
                  </Button>
                </div>
                <div className="grow flex justify-end">
                  <Button
                    size="1"
                    onClick={() => {
                      handleAccordionToggle("checkout-2")
                    }}
                  >
                    <span className="cursor-pointer">
                      2. Billing And Shipping{" "}
                      <FontAwesomeIcon icon={faArrowRight} size="sm" />
                    </span>
                  </Button>
                </div>
              </Flex>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item className="AccordionItem" value="checkout-2">
          <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger>
              <h2 className="text-lg font-bold text-gray-800 flex items-center py-5 cursor-pointer">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-medium mr-3">
                  2
                </span>
                Billing and Shipping Information
              </h2>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="AccordionContent">
            <div className="p-4">
              <CheckoutBillingShipping />
            </div>
            <div className="px-4 w-full">
              <Flex className="justify-between w-full mt-4">
                <div className="grow">
                  <Button
                    size="1"
                    onClick={() => {
                      handleAccordionToggle("checkout-1")
                    }}
                  >
                    <span className="cursor-pointer">
                      <FontAwesomeIcon icon={faArrowLeft} size="sm" /> 1. Cart
                      Summary
                    </span>
                  </Button>
                </div>
                <div className="grow flex justify-end">
                  <Button
                    size="1"
                    onClick={() => {
                      handleAccordionToggle("checkout-3")
                    }}
                  >
                    <span className="cursor-pointer">
                      3. Payment Information{" "}
                      <FontAwesomeIcon icon={faArrowRight} size="sm" />
                    </span>
                  </Button>
                </div>
              </Flex>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item className="AccordionItem" value="checkout-3">
          <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger>
              <h2 className="text-lg font-bold text-gray-800 flex items-center py-5 cursor-pointer">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-medium mr-3">
                  3
                </span>
                Payment Information
              </h2>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="AccordionContent">
            <div className="p-4">
              <CheckoutPayment />
            </div>
            <div className="px-4 w-full">
              <Flex className="justify-between w-full mt-4">
                <div className="grow">
                  <Button
                    size="1"
                    onClick={() => {
                      handleAccordionToggle("checkout-2")
                    }}
                  >
                    <span className="cursor-pointer">
                      <FontAwesomeIcon icon={faArrowLeft} size="sm" /> 2.
                      Shipping & Billing
                    </span>
                  </Button>
                </div>
                <div className="grow flex justify-end">
                  <button
                    type="submit"
                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Complete Purchase
                  </button>
                </div>
              </Flex>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

export default CheckoutForm
