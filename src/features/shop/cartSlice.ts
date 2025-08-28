import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "@/types"
import { CartOrderCreationState, CartPaymentState } from "@/types"

const initialState = {
  items: [] as CartItem[],
  category: "",
  shippingTypeId: "",
  cartOPState: {
    cartOPPaymentState: CartPaymentState.Idle,
    cartOPOrderCreationState: CartOrderCreationState.Idle,
  },
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addUpdateCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id,
      )
      if (existingItem) {
        existingItem.qty = action.payload.qty
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearCart: state => {
      state.items = []
      state.category = ""
      state.shippingTypeId = ""
    },
    setCartCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setCartShippingType: (state, action: PayloadAction<string>) => {
      state.shippingTypeId = action.payload
    },
    setCartPaymentState: (state, action: PayloadAction<CartPaymentState>) => {
      state.cartOPState.cartOPPaymentState = action.payload
    },
    setCartOrderCreationState: (
      state,
      action: PayloadAction<CartOrderCreationState>,
    ) => {
      state.cartOPState.cartOPOrderCreationState = action.payload
    },
    resetCartOPState: state => {
      state.cartOPState = {
        cartOPPaymentState: CartPaymentState.Idle,
        cartOPOrderCreationState: CartOrderCreationState.Idle,
      }
    },
  },
  selectors: {
    cartItems: state => state.items,
    cartCount: state => state.items.length,
    cartCategory: state => state.category,
    cartShippingType: state => state.shippingTypeId,
    cartOPOrderCreationState: state =>
      state.cartOPState.cartOPOrderCreationState,
    cartOPPaymentState: state => state.cartOPState.cartOPPaymentState,
    cartOPState: state => state.cartOPState,
  },
})

export const {
  addUpdateCart,
  removeFromCart,
  clearCart,
  setCartCategory,
  setCartShippingType,
  setCartOrderCreationState,
  setCartPaymentState,
  resetCartOPState,
} = cartSlice.actions
export const {
  cartItems,
  cartCount,
  cartCategory,
  cartShippingType,
  cartOPOrderCreationState,
  cartOPPaymentState,
  cartOPState,
} = cartSlice.selectors
export const selectCartItems = (state: { cart: { items: CartItem[] } }) =>
  state.cart.items
