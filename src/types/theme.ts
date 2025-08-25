// src/types/theme.ts
export type ThemeAppearance = "light" | "dark"

export type ThemeColor = "blue" | "green" | "purple"

export type ThemeConfig = {
  appearance: ThemeAppearance
  color: ThemeColor
}

export type ThemeName = `${ThemeColor}-${ThemeAppearance}`

// Predefined themes
export const THEMES: Record<ThemeName, ThemeConfig> = {
  "blue-light": { appearance: "light", color: "blue" },
  "green-light": { appearance: "light", color: "green" },
  "purple-light": { appearance: "light", color: "purple" },
  "blue-dark": { appearance: "dark", color: "blue" },
  "green-dark": { appearance: "dark", color: "green" },
  "purple-dark": { appearance: "dark", color: "purple" },
}
