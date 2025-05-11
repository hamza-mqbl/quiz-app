"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import ProfilePage from "@/app/profile/page";

export default function TeacherProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in or not a teacher
  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // Will show loading state from parent layout
  }

  return <ProfilePage />;
}
