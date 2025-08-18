import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "../../types"

const initialState = {
  items: [] as CartItem[],
  category: "",
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
    },
    setCartCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
  },
  selectors: {
    cartItems: state => state.items,
    cartCount: state => state.items.length,
    cartCategory: state => state.category,
  },
})

export const { addUpdateCart, removeFromCart, clearCart, setCartCategory } =
  cartSlice.actions
export const { cartItems, cartCount, cartCategory } = cartSlice.selectors
export const selectCartItems = (state: { cart: { items: CartItem[] } }) =>
  state.cart.items
