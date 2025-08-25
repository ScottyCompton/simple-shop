// src/page/ThemeTest.tsx
import { useState } from "react"
import { Box, Flex, Card, Heading, Text, Button } from "@radix-ui/themes"
import { useTheme } from "@/context/ThemeContext"
import RadixThemedButton from "@/components/ui/RadixThemedButton"

const ThemeTestPage = () => {
  const { themeConfig } = useTheme()
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Heading as="h1" size="6" mb="4">
        Theme Testing Page
      </Heading>
      <Text as="p" mb="6">
        Current theme: {themeConfig.color} - {themeConfig.appearance}
      </Text>

      <Flex gap="4" direction="column">
        <Card>
          <Heading as="h2" size="4" mb="2">
            Radix UI Components
          </Heading>
          <Flex direction="column" gap="4">
            <input
              className="border p-2 rounded"
              placeholder="Test input"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputValue(e.target.value)
              }}
              style={{ borderColor: "var(--color-primary)" }}
            />

            <Flex gap="2">
              <Button>Default Button</Button>
              <RadixThemedButton>Themed Button</RadixThemedButton>
              <RadixThemedButton variant="outline">Outline</RadixThemedButton>
              <RadixThemedButton variant="soft">Soft</RadixThemedButton>
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Heading as="h2" size="4" mb="2">
            CSS Variable Tests
          </Heading>
          <Box mb="4">
            <div
              className="p-4 mb-2"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
              }}
            >
              Primary Color Block
            </div>
            <div
              className="p-4 mb-2"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "white",
              }}
            >
              Secondary Color Block
            </div>
            <div
              className="p-4 mb-2 border"
              style={{
                backgroundColor: "var(--color-background)",
                color: "var(--color-text)",
                borderColor: "var(--color-muted)",
              }}
            >
              Background with Text Color
            </div>
            <div className="p-4" style={{ color: "var(--color-muted)" }}>
              Muted Text Color
            </div>
          </Box>
        </Card>
      </Flex>
    </div>
  )
}

export default ThemeTestPage
