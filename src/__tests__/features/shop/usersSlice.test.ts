import {
  userSlice,
  setUser,
  clearUser,
  setUserHasBilling,
  setUserHasShipping,
  selectUser,
  selectHasBilling,
  selectHasShipping,
  selectUserLastUpdate,
} from "../../../features/shop/usersSlice"
import { vi } from "vitest"
import type { User } from "../../../types"

describe("userSlice", () => {
  const initialState = {
    user: null,
  }

  const mockUser: User = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    hasBilling: false,
    hasShipping: false,
    lastUpdate: new Date().toISOString(),
  }

  it("should return the initial state", () => {
    expect(userSlice.reducer(undefined, { type: undefined })).toEqual(
      initialState,
    )
  })

  describe("setUser", () => {
    it("should set the user in state", () => {
      const action = setUser(mockUser)
      const result = userSlice.reducer(initialState, action)

      expect(result.user).toEqual(mockUser)
    })

    it("should save user to localStorage", () => {
      const localStorageSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {})
      const action = setUser(mockUser)
      userSlice.reducer(initialState, action)

      expect(localStorageSpy).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockUser),
      )
      localStorageSpy.mockRestore()
    })
  })

  describe("clearUser", () => {
    it("should clear the user from state", () => {
      const stateWithUser = { user: mockUser }
      const action = clearUser()
      const result = userSlice.reducer(stateWithUser, action)

      expect(result.user).toBeNull()
    })
  })

  describe("setUserHasBilling", () => {
    it("should update hasBilling flag", () => {
      const stateWithUser = { user: { ...mockUser } }
      const action = setUserHasBilling(true)
      const result = userSlice.reducer(stateWithUser, action)

      expect(result.user?.hasBilling).toBe(true)
    })

    it("should update lastUpdate timestamp", () => {
      const stateWithUser = {
        user: { ...mockUser, lastUpdate: "2020-01-01" },
      }
      const before = new Date().toISOString()
      const action = setUserHasBilling(true)
      const result = userSlice.reducer(stateWithUser, action)
      const after = new Date().toISOString()

      if (result.user?.lastUpdate) {
        expect(
          new Date(result.user.lastUpdate).getTime(),
        ).toBeGreaterThanOrEqual(new Date(before).getTime())
        expect(
          new Date(result.user.lastUpdate).getTime(),
        ).toBeLessThanOrEqual(new Date(after).getTime())
      }
    })

    it("should not update if user is null", () => {
      const action = setUserHasBilling(true)
      const result = userSlice.reducer(initialState, action)

      expect(result.user).toBeNull()
    })
  })

  describe("setUserHasShipping", () => {
    it("should update hasShipping flag", () => {
      const stateWithUser = { user: { ...mockUser } }
      const action = setUserHasShipping(true)
      const result = userSlice.reducer(stateWithUser, action)

      expect(result.user?.hasShipping).toBe(true)
    })

    it("should update lastUpdate timestamp", () => {
      const stateWithUser = {
        user: { ...mockUser, lastUpdate: "2020-01-01" },
      }
      const before = new Date().toISOString()
      const action = setUserHasShipping(true)
      const result = userSlice.reducer(stateWithUser, action)
      const after = new Date().toISOString()

      if (result.user?.lastUpdate) {
        expect(
          new Date(result.user.lastUpdate).getTime(),
        ).toBeGreaterThanOrEqual(new Date(before).getTime())
        expect(
          new Date(result.user.lastUpdate).getTime(),
        ).toBeLessThanOrEqual(new Date(after).getTime())
      }
    })

    it("should not update if user is null", () => {
      const action = setUserHasShipping(true)
      const result = userSlice.reducer(initialState, action)

      expect(result.user).toBeNull()
    })
  })

  describe("selectors", () => {
    it.skip("selectUser selector returns user", () => {})
    it.skip("selectHasBilling selector returns hasBilling", () => {})
    it.skip("selectHasShipping selector returns hasShipping", () => {})
    it.skip("selectUserLastUpdate selector returns lastUpdate", () => {})
  })
})
