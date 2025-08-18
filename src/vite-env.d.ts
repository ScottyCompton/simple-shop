/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_API_URL: string
  // add more env vars here if needed
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}

// Path alias declarations
declare module "@css/*" {
  const styles: Record<string, string>
  export default styles
}

declare module "@hooks" {
  export * from "./app/hooks"
}

declare module "@types" {
  export * from "./types"
}

declare module "@features/*" {
  // Using unknown instead of any for better type safety
  export * from "./features/*"
}

declare module "@components/*" {
  // Using unknown instead of any for better type safety
  import type { ComponentType } from "react"
  const component: ComponentType<unknown>
  export default component
}
