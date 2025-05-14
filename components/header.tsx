"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const routes = [
    { href: "/", label: "Home" },
    ...(isTeacher
      ? [
          { href: "/teacher/dashboard", label: "Dashboard" },
          { href: "/teacher/quizzes", label: "My Quizzes" },
          { href: "/teacher/students", label: "Students" },
        ]
      : []),
    ...(isStudent
      ? [
          { href: "/student/dashboard", label: "Dashboard" },
          { href: "/student/quizzes", label: "Available Quizzes" },
          { href: "/student/results", label: "My Results" },
        ]
      : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 w-[280px]">
              <div className="flex items-center justify-between pb-4 border-b">
                <Link
                  href="/"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center space-x-2"
                >
                  <span className="font-bold text-xl">MLQDPS</span>
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="grid gap-6 text-lg font-medium py-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setSheetOpen(false)}
                    className={`hover:text-primary transition-colors ${
                      pathname === route.href
                        ? "text-primary font-semibold"
                        : "text-foreground/60"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                {user ? (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSheetOpen(false);
                      signOut();
                    }}
                    className="text-foreground/60 hover:text-primary transition-colors"
                  >
                    Sign Out
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setSheetOpen(false)}
                      className="text-foreground/60 hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setSheetOpen(false)}
                      className="text-foreground/60 hover:text-primary transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              MLQDPS
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href
                    ? "text-primary"
                    : "text-foreground/60"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={isTeacher ? "/teacher/profile" : "/student/profile"}
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        isTeacher ? "/teacher/dashboard" : "/student/dashboard"
                      }
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hover:text-primary hover:bg-primary/10"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-6 shadow-md shadow-primary/20"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
