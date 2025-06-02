"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Home,
  Settings,
  User,
  Users,
  BarChart,
  UserCog,
  Shield,
  Database,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-muted md:min-h-screen">
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Admin
              </span>
            </div>
            <Separator />
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/teachers">
                  <UserCog className="mr-2 h-4 w-4" />
                  Teachers
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
