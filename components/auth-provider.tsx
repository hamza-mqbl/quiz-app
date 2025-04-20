"use client";

import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Cookies from "js-cookie";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
};

type AuthContextType = {
  user: User | null;
  signIn: (
    email: string,
    password: string,
    role: "teacher" | "student"
  ) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    role: "teacher" | "student"
  ) => Promise<void>;
  signOut: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUserFromServer();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (
    email: string,
    password: string,
    role: "teacher" | "student"
  ) => {
    setLoading(true);
    try {
      await authService.signIn(email, password, role); // ✅ only signin

      const currentUser = await authService.getCurrentUserFromServer(); // ✅ fetch real user
      console.log("🚀 ~ AuthProvider ~ currentUser:", currentUser);

      setUser(currentUser);

      router.push(`/${currentUser.role}/dashboard`); // ✅ use currentUser.role
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    role: "teacher" | "student"
  ) => {
    setLoading(true);
    try {
      const data = await authService.signUp(name, email, password, role);
      Cookies.set("user", JSON.stringify(data.user), {
        expires: 7,
        secure: true,
      });
      setUser(data.user);
      router.push(`/${role}/dashboard`);
    } catch (error) {
      console.error("Sign up failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      Cookies.remove("user");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
