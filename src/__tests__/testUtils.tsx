import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { combineSlices, configureStore, PreloadedState } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import type { RootState } from "../app/store"
import { cartSlice } from "@/features/shop/cartSlice"
import { userSlice } from "@/features/shop/usersSlice"
import { productsApiSlice } from "@/features/shop/productsApiSlice"
import { userApiSlice } from "@/features/shop/userApiSlice"

// Create the same root reducer as the app
const rootReducer = combineSlices(
  cartSlice,
  productsApiSlice,
  userApiSlice,
  userSlice,
)

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof configureStore>
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
          productsApiSlice.middleware,
          userApiSlice.middleware,
        ),
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  // Configure listeners for RTK Query
  setupListeners(store.dispatch)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    )
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), store }
}

export * from "@testing-library/react"
