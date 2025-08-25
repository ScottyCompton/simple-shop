// src/utils/themeUtils.ts
import type { CSSProperties } from "react"

type ThemedStyles = {
  container?: CSSProperties
  text?: CSSProperties
  border?: CSSProperties
  background?: CSSProperties
}

export const getThemedStyles = (
  variant: "primary" | "secondary" = "primary",
): ThemedStyles => {
  return {
    container: {
      backgroundColor:
        variant === "primary"
          ? "var(--color-primary)"
          : "var(--color-secondary)",
    },
    text: {
      color: "var(--color-text)",
    },
    border: {
      borderColor: "var(--color-muted)",
    },
    background: {
      backgroundColor: "var(--color-background)",
    },
  }
}
