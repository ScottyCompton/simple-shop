// src/utils/debugTheme.ts
export function logCSSVariables() {
  const styles = getComputedStyle(document.documentElement)

  console.log("Theme Debug - CSS Variables:")
  console.log("--color-primary:", styles.getPropertyValue("--color-primary"))
  console.log(
    "--color-secondary:",
    styles.getPropertyValue("--color-secondary"),
  )
  console.log(
    "--color-background:",
    styles.getPropertyValue("--color-background"),
  )
  console.log("--color-text:", styles.getPropertyValue("--color-text"))
  console.log("--color-muted:", styles.getPropertyValue("--color-muted"))

  console.log("Document Classes:", document.documentElement.className)
}
