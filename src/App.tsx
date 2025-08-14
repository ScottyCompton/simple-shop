import { StrictMode } from "react"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./App.css"
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css";
import AppRouter from './routes/AppRouter'
import { Toaster } from 'react-hot-toast'

export const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <Theme>
            <AppRouter />
        </Theme>
        <Toaster />
      </Provider>
    </StrictMode>
  )
}
