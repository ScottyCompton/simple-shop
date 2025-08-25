import { StrictMode } from "react"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "@radix-ui/themes/styles.css"
import "@/css/themes.css"
import "@/css/theme-utils.css"
import "@/css/theme-direct.css"
import "@/css/theme-components.css"
import "@/css/layout-enhancements.css"
import "@/css/themed-typography.css"
import "@/css/App.css"
import AppRouter from "./routes/AppRouter"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/context/ThemeContext"

export const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
        <Toaster />
      </Provider>
    </StrictMode>
  )
}
