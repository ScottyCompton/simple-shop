/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_API_URL: string
  // add more env vars here if needed
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}
