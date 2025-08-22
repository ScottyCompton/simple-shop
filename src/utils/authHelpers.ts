import type { User } from "@/types"
import { getUserFromToken as getUser } from "./authUtils"

/**
 * A wrapper around getUserFromToken that helps with TypeScript errors
 */
export async function safeGetUserFromToken(
  token: string,
): Promise<User | null> {
  try {
    return await getUser(token)
  } catch (error) {
    console.error("Error in safeGetUserFromToken:", error)
    return null
  }
}
