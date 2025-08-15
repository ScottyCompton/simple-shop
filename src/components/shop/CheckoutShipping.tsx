
import { useForm } from 'react-hook-form';
import type { UserShipping as ShippingFormData } from '../../types';
import '../../css/checkout.css';
import StateSelect from '../StateSelect';


// Shipping methods
const shippingMethods = [
  { id: 'ups', name: 'UPS', description: 'Delivery in 3-5 business days', price: '$9.99' },
  { id: 'fedex', name: 'FedEx', description: 'Delivery in 2-3 business days', price: '$14.99' },
  { id: 'usps', name: 'USPS', description: 'Delivery in 4-7 business days', price: '$7.99' },
];

const CheckoutShipping = () => {


  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<ShippingFormData>();
  
  // Handle form submission
  const submitHandler = (data: ShippingFormData) => {
    console.log(data);
    // In a real app, you would save this data or pass it to a parent component
  };
  
  // Handle form submission with error prevention
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(submitHandler)();
  };

  return (
    <div className="p-4">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* First and Last Name - Two columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        {/* Address Line 1 */}
        <div className="space-y-2">
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
            Address Line 1
          </label>
          <input
            id="address1"
            type="text"
            {...register('address1', { required: 'Address is required' })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.address1 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            placeholder="123 Main St"
          />
          {errors.address1 && (
            <p className="text-sm text-red-500 mt-1">{errors.address1.message}</p>
          )}
        </div>
        
        {/* Address Line 2 (optional) */}
        <div className="space-y-2">
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
            Address Line 2 <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            id="address2"
            type="text"
            {...register('address2')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apt 4B"
          />
        </div>
        
        {/* City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              type="text"
              {...register('city', { required: 'City is required' })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Los Angeles"
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <StateSelect />
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              id="zip"
              type="text"
              {...register('zip', { 
                required: 'ZIP code is required',
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Invalid ZIP code format'
                }
              })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.zip ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="90028"
            />
            {errors.zip && (
              <p className="text-sm text-red-500 mt-1">{errors.zip.message}</p>
            )}
          </div>
        </div>
        
        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                message: 'Invalid phone number format'
              }
            })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        {/* Shipping Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
          <div className="grid grid-cols-1 gap-3">
            {shippingMethods.map((method) => (
              <div key={method.id} className="relative">
                <input
                  type="radio"
                  id={method.id}
                  value={method.id}
                  {...register('shippingMethod', { required: 'Please select a shipping method' })}
                  className="absolute opacity-0 w-0 h-0"
                />
                <label
                  htmlFor={method.id}
                  className="flex items-center justify-between p-4 cursor-pointer w-full border border-gray-200 rounded-md hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-600"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 rounded-full border border-gray-400 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 hidden shipping-method-dot"></div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-900">{method.name}</span>
                      <span className="block text-xs text-gray-500">{method.description}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{method.price}</span>
                </label>
              </div>
            ))}
          </div>
          {errors.shippingMethod && (
            <p className="text-sm text-red-500 mt-1">{errors.shippingMethod.message}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to Billing
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutShipping;