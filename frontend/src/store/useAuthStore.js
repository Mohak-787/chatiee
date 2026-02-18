import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  authUser: { name: "", _id: 3, age: 0 },
  isLoggedIn: false,
  isLoading: false,

  login: () => {
    console.log("We just logged in"),
      set({ isLoggedIn: true, isLoading: true })
  }
}))