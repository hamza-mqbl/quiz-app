"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  FileText,
  BarChart,
  CheckCircle,
  XCircle,
  Edit,
  MessageSquare,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import TeacherLayout from "@/components/teacher-layout";
import axios from "axios";

// Mock student data
const mockStudentData = {
  id: "681f6a4a39f7a5d373b530e0",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  joinedDate: "2023-01-15",
  lastActive: "2023-05-10",
  status: "active",
  profileImage: null,
  bio: "Enthusiastic learner with a passion for science and mathematics.",
  performance: {
    quizzesTaken: 12,
    quizzesCompleted: 12,
    avgScore: 94,
    highestScore: 98,
    lowestScore: 85,
    totalTimeSpent: "8h 45m",
    avgTimePerQuiz: "43m",
  },
  subjects: [
    { name: "Biology", avgScore: 96, quizzesTaken: 4 },
    { name: "Chemistry", avgScore: 92, quizzesTaken: 3 },
    { name: "Physics", avgScore: 90, quizzesTaken: 3 },
    { name: "Mathematics", avgScore: 95, quizzesTaken: 2 },
  ],
};

export default function StudentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // const studentId = params.id;
  const { id: studentId } = useParams();

  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the student data from your API
    // const fetchStudentData = async () => {
    //   try {
    //     setLoading(true);
    //     // Simulate API call
    //     await new Promise((resolve) => setTimeout(resolve, 1000));

    //     // Use mock data for demo
    //     setStudent(mockStudentData);
    //     setError(null);
    //   } catch (error) {
    //     console.error("Failed to fetch student data:", error);
    //     setError("Failed to load student data. Please try again.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/student-details/${studentId}`,
          { withCredentials: true }
        );
        setStudent(res.data.student);
      } catch (err) {
        setError("Failed to load student data. Please try again.");
        console.error("Failed to fetch student details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();

    // fetchStudentData();
  }, [studentId]);

  const handleSendMessage = async () => {
    setSendingMessage(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${student.name}.`,
    });

    setSendingMessage(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <Skeleton className="h-10 w-full max-w-xs" />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (error || !student) {
    return (
      <TeacherLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex flex-col items-center text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Failed to Load Student Data
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "Student not found"}
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/teacher/students")}
              >
                Back to Students
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage
                src={
                  student.profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
                }
                alt={student.name}
              />
              <AvatarFallback className="text-lg">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {student.name}
                </h1>
                <Badge
                  variant={
                    student.status === "active" ? "default" : "secondary"
                  }
                >
                  {student.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{student.email}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => router.push("/teacher/students")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
            <Button
              className="flex-1 md:flex-none"
              onClick={handleSendMessage}
              disabled={sendingMessage}
            >
              {sendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Student
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <span>{student.email}</span>
                  </div>
                  {/* <Separator /> */}
                  {/* <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <span>{student.phone}</span>
                  </div> */}
                  <Separator />
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Joined Date</span>
                    </div>
                    <span>{formatDate(student.joinedDate)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Last Active</span>
                    </div>
                    <span>{formatDate(student.lastActive)}</span>
                  </div>
                  {student.bio && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Bio</div>
                        <p className="text-sm text-muted-foreground">
                          {student.bio}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
                {/* <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/teacher/students/${studentId}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Student Information
                    </Link>
                  </Button>
                </CardFooter> */}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Quizzes Taken
                      </div>
                      <div className="text-2xl font-bold">
                        {student.performance.quizzesTaken}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Average Score
                      </div>
                      <div className="text-2xl font-bold flex items-center">
                        {student.performance.avgScore}%
                        {student.performance.avgScore >= 90 && (
                          <Award className="ml-1 h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Highest Score
                      </div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {student.performance.highestScore}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Lowest Score
                      </div>
                      <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {student.performance.lowestScore}%
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="text-sm font-medium">
                      Subject Performance
                    </div>
                    {student.subjects.map((subject: any) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{subject.name}</span>
                          <span className="font-medium">
                            {subject.avgScore}%
                          </span>
                        </div>
                        <Progress value={subject.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/teacher/students/${studentId}/results`}>
                      <BarChart className="mr-2 h-4 w-4" />
                      View Detailed Results
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest quiz attempts and completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.recentActivity.slice(0, 3).map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.type === "quiz_completed" ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : activity.type === "quiz_started" ? (
                            <Clock className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{activity.quizName}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateTime(activity.date)} • Time spent:{" "}
                            {activity.timeSpent}
                          </div>
                        </div>
                      </div>
                      {activity.score !== null && (
                        <Badge
                          variant="outline"
                          className={`${
                            activity.score >= 90
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : activity.score >= 75
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                          }`}
                        >
                          Score: {activity.score}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/teacher/students/${studentId}/activity`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View All Activity
                  </Link>
                </Button>
              </CardFooter>
            </Card> */}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed performance statistics for this student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {student.performance.avgScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Score
                    </div>
                    <Progress
                      value={student.performance.avgScore}
                      className="h-2 w-full mt-2"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold mb-1">
                      {student.performance.quizzesTaken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quizzes Taken
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {student.performance.quizzesCompleted} completed
                    </div>
                  </div>
                  {/* <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold mb-1">
                      {student.performance.totalTimeSpent}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Time Spent
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Avg: {student.performance.avgTimePerQuiz} per quiz
                    </div>
                  </div> */}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Subject Performance</h3>
                  <div className="space-y-6">
                    {student.subjects.map((subject: any) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subject.quizzesTaken} quizzes taken
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Score</span>
                          <span
                            className={`font-medium ${
                              subject.avgScore >= 90
                                ? "text-green-600 dark:text-green-400"
                                : subject.avgScore >= 75
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {subject.avgScore}%
                          </span>
                        </div>
                        <Progress value={subject.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/teacher/students/${studentId}/results`}>
                    <BarChart className="mr-2 h-4 w-4" />
                    View Detailed Results
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          {/* 
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Complete history of student's quiz activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {student.recentActivity.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        {activity.type === "quiz_completed" ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : activity.type === "quiz_started" ? (
                          <Clock className="h-5 w-5 text-primary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="font-medium">
                              {activity.quizName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDateTime(activity.date)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">
                              Time spent: {activity.timeSpent}
                            </div>
                            {activity.score !== null && (
                              <Badge
                                variant="outline"
                                className={`${
                                  activity.score >= 90
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                    : activity.score >= 75
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                }`}
                              >
                                Score: {activity.score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Teacher Notes</CardTitle>
                  <CardDescription>
                    Notes and observations about this student
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {student.notes.length > 0 ? (
                    student.notes.map((note: any) => (
                      <div
                        key={note.id}
                        className="space-y-2 border-b pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{note.createdBy}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateTime(note.createdAt)}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No notes have been added for this student yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </TeacherLayout>
  );
}
