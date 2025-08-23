import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types"

const initialState = {
  user: null as User | null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    setUserHasBilling: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.hasBilling = action.payload
        state.user.lastUpdate = new Date().toISOString()
      }
    },
    setUserHasShipping: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.hasShipping = action.payload
        state.user.lastUpdate = new Date().toISOString()
      }
    },
    clearUser: state => {
      state.user = null
    },
  },
  selectors: {
    selectUser: state => state.user,
    selectHasBilling: state => state.user?.hasBilling,
    selectHasShipping: state => state.user?.hasShipping,
    selectUserLastUpdate: state => state.user?.lastUpdate,
  },
})

export const { setUser, clearUser, setUserHasBilling, setUserHasShipping } =
  userSlice.actions
export const {
  selectUser,
  selectHasBilling,
  selectHasShipping,
  selectUserLastUpdate,
} = userSlice.selectors
