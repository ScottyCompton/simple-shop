import {
  userApiSlice,
  userApiSliceExtended,
  useGetUserByIdQuery,
  useAuthenticateUserMutation,
  useVerifyTokenQuery,
} from "../../../features/shop/userApiSlice"

describe("userApiSlice", () => {
  it("should have the correct reducerPath", () => {
    expect(userApiSlice.reducerPath).toBe("userApi")
  })

  it("should have defined utilities", () => {
    expect(userApiSlice.util).toBeDefined()
  })

  it("should have defined endpoints", () => {
    expect(userApiSlice.endpoints).toBeDefined()
    expect(userApiSlice.endpoints.getUserById).toBeDefined()
    expect(userApiSlice.endpoints.authenticateUser).toBeDefined()
  })

  it("should export hooks correctly", () => {
    expect(useGetUserByIdQuery).toBeDefined()
    expect(useAuthenticateUserMutation).toBeDefined()
  })
})

describe("userApiSliceExtended", () => {
  it("should have extended endpoints", () => {
    expect(userApiSliceExtended.endpoints).toBeDefined()
    expect(userApiSliceExtended.endpoints.verifyToken).toBeDefined()
  })

  it("should export extended hooks correctly", () => {
    expect(useVerifyTokenQuery).toBeDefined()
  })

  describe("verifyToken endpoint", () => {
    it("should be defined and configured correctly", () => {
      expect(userApiSliceExtended.endpoints.verifyToken).toBeDefined()
    })
  })
})
