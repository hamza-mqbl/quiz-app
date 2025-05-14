"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  UserCircle2,
  KeyRound,
  GraduationCap,
  School,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
// ✅ Correct import for Next.js App Router
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["teacher", "student"], {
    required_error: "Please select a role.",
  }),
});

export default function SignInPage() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  console.log("🚀 ~ SignInPage ~ user:", user);

  useEffect(() => {
    if (user) {
      if (user.role === "teacher") {
        router.replace("/teacher/dashboard");
      } else if (user.role === "student") {
        router.replace("/student/dashboard");
      }
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "teacher",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await signIn(values.email, values.password, values.role);
      toast({
        title: "Sign in successful",
        description: `Welcome back! You are now signed in as a ${values.role}.`,
      });
    } catch (error: any) {
      console.log("🚀 ~ onSubmit ~ error:,,,,,,,,,", error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 md:py-20">
        <div className="container grid gap-6 px-4 md:grid-cols-2 lg:gap-10 xl:gap-20">
          <div className="hidden md:flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Welcome back to <span className="text-primary">MLQDPS</span>
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Sign in to continue your learning journey and access your
                quizzes
              </p>
            </div>
            <div className="flex flex-col gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <span>Access all your quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle2 className="h-4 w-4 text-primary" />
                </div>
                <span>Get personalized insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <span>Track your progress</span>
              </div>
            </div>
          </div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="teacher" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex items-center gap-1.5">
                                <School className="h-4 w-4 text-primary" />
                                Teacher
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="student" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex items-center gap-1.5">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Student
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  Microsoft
                </Button>
                <Button
                  onClick={() =>
                    toast({
                      title: "Test Toast",
                      description: "Should appear now",
                    })
                  }
                >
                  Test Toast
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
