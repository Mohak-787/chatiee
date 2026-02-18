import { create } from 'zustand'
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isloggingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
    } catch (error) {
      console.error("Error checking auth in client side: ", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data)
      set({ authUser: res.data })

      toast.success("Account created successfully")
    } catch (error) {
      console.error("Error signing user in client side: ", error)
      set({ authUser: null })

      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isloggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data })

      toast.success("Logged in successfully")
    } catch (error) {
      console.error("Error signing user in client side: ", error)
      set({ authUser: null })

      toast.error(error.response.data.message)
    } finally {
      set({ isloggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Error logging out user in client side: ", error)

      toast.error(error.response.data.message)
    }
  }
}))