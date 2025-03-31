"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "teacher" | "student"
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string, role: "teacher" | "student") => Promise<void>
  signUp: (name: string, email: string, password: string, role: "teacher" | "student") => Promise<void>
  signOut: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string, role: "teacher" | "student") => {
    setLoading(true)
    try {
      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split("@")[0],
        email,
        role,
      }

      // Store user in localStorage (in a real app, you'd use cookies or tokens)
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      // Redirect based on role
      if (role === "teacher") {
        router.push("/teacher/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, role: "teacher" | "student") => {
    setLoading(true)
    try {
      // In a real app, you would make an API call to register
      // For demo purposes, we'll simulate a successful registration
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
      }

      // Store user in localStorage (in a real app, you'd use cookies or tokens)
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      // Redirect based on role
      if (role === "teacher") {
        router.push("/teacher/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

