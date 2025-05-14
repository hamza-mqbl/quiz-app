"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Save,
  Loader2,
  User,
  Mail,
  Lock,
  Camera,
  LogOut,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import axios from "axios";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  //   bio: z.string().optional(),
});

// Password form schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

// Notification settings schema

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Initialize password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else {
      // Set default values for profile form
      profileForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, router, profileForm]);

  // Handle profile form submission
  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`,
        {
          name: values.name,
          email: values.email,
        },
        { withCredentials: true }
      );
      await authService.getCurrentUserFromServer();

      toast({
        title: "Profile Updated",
        description:
          response.data.message ||
          "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (
    values: z.infer<typeof passwordFormSchema>
  ) => {
    setIsPasswordLoading(true);

    try {
      // In a real app, you would make an API call to update the user's password
      console.log("Updating password:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });

      // Reset password form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast({
        title: "Update Failed",
        description:
          "There was an error updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      // In a real app, you would make an API call to delete the user's account
      console.log("Deleting account");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });

      // Sign out the user
      signOut();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast({
        title: "Delete Failed",
        description:
          "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteAccountDialogOpen(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Profile Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and set your preferences.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                        />
                        <AvatarFallback className="text-2xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change avatar</span>
                      </Button>
                    </div>
                    <div className="space-y-1 text-center">
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="w-full">
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Role</span>
                        </div>
                        <span className="text-sm capitalize">{user.role}</span>
                      </div>
                      <Separator className="my-4" />
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Information</CardTitle>
                      <CardDescription>
                        Update your personal information and profile settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form
                          id="profile-form"
                          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      placeholder="Your name"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  This is your public display name.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      type="email"
                                      placeholder="Your email address"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  This email will be used for sign-in.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => profileForm.reset()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        form="profile-form"
                        disabled={isLoading || !profileForm.formState.isDirty}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Danger Zone</CardTitle>
                      <CardDescription>
                        Permanently delete your account and all of your data.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back.
                        This action cannot be undone.
                      </p>
                      <AlertDialog
                        open={deleteAccountDialogOpen}
                        onOpenChange={setDeleteAccountDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...passwordForm}>
                        <form
                          id="password-form"
                          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      type="password"
                                      placeholder="Enter your current password"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      type="password"
                                      placeholder="Enter your new password"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Password must be at least 8 characters long.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      type="password"
                                      placeholder="Confirm your new password"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => passwordForm.reset()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        form="password-form"
                        disabled={
                          isPasswordLoading || !passwordForm.formState.isDirty
                        }
                      >
                        {isPasswordLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
