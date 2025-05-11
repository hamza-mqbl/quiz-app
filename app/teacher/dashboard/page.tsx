"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Users,
  Plus,
  BarChart,
  TrendingUp,
  Award,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import TeacherLayout from "@/components/teacher-layout";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Mock data for chart
const activityData = [
  { name: "Mon", quizzes: 3, students: 15 },
  { name: "Tue", quizzes: 5, students: 23 },
  { name: "Wed", quizzes: 2, students: 12 },
  { name: "Thu", quizzes: 7, students: 45 },
  { name: "Fri", quizzes: 4, students: 32 },
  { name: "Sat", quizzes: 1, students: 5 },
  { name: "Sun", quizzes: 0, students: 0 },
];

// Performance data
// const performanceData = [
//   { subject: "Biology", avg: 78, highest: 95, lowest: 62 },
//   { subject: "Chemistry", avg: 85, highest: 98, lowest: 70 },
//   { subject: "Physics", avg: 72, highest: 90, lowest: 55 },
//   { subject: "Mathematics", avg: 68, highest: 92, lowest: 45 },
// ];

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  console.log("🚀 ~ TeacherDashboard ~ recentQuizzes:", recentQuizzes);

  const router = useRouter();
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/getTeacherDashboardStats`,
          { withCredentials: true }
        );

        const data = res.data.stats;
        setTopPerformers(data.topPerformers || []);
        setPerformanceData(data.performanceData || []);
        setActivityData(data.activityData || []);
        setRecentQuizzes(data.recentQuizzes || []);

        const getTrend = (current: number, previous: number) => {
          const diff = current - previous;
          return {
            trend: `${diff >= 0 ? "+" : ""}${diff}`,
            trendUp: diff >= 0,
          };
        };

        const getPercentageTrend = (current: number, previous: number) => {
          if (previous === 0 || current === 0) {
            return {
              trend: "—",
              trendUp: false,
            };
          }
          const diff = Math.round(((current - previous) / previous) * 100);
          return {
            trend: `${diff >= 0 ? "+" : ""}${diff}%`,
            trendUp: diff >= 0,
          };
        };

        const scoreTrend = getPercentageTrend(
          data.recentAverageScore,
          data.previousAverageScore
        );
        const activeTrend = getTrend(
          data.recentActiveStudents,
          data.previousActiveStudents
        );
        const activityTrend = getTrend(
          data.recentActivity,
          data.previousActivity
        );

        setStats([
          {
            title: "Total Quizzes",
            value: data.totalQuizzes,
            icon: BookOpen,
            description: "Across all subjects",
            trend: "+0",
            trendUp: true,
          },
          {
            title: "Active Students",
            value: data.activeStudents,
            icon: Users,
            description: "Students who took quizzes",
            ...activeTrend,
          },
          {
            title: "Recent Activity",
            value: data.recentActivity,
            icon: Clock,
            description: "Quizzes in the last 7 days",
            ...activityTrend,
          },
          {
            title: "Average Score",
            value: data.averageScore,
            icon: BarChart,
            description: "Across all quizzes",
            ...scoreTrend,
          },
        ]);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err);
      }
    };

    fetchDashboardStats();
  }, []);

  // Redirect if not logged in or not a teacher
  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data for dashboard
  // const stats = [
  //   {
  //     title: "Total Quizzes",
  //     value: "12",
  //     icon: BookOpen,
  //     description: "Across all subjects",
  //     trend: "+2 this month",
  //     trendUp: true,
  //   },
  //   {
  //     title: "Active Students",
  //     value: "156",
  //     icon: Users,
  //     description: "Students who took quizzes",
  //     trend: "+24 this month",
  //     trendUp: true,
  //   },
  //   {
  //     title: "Recent Activity",
  //     value: "3",
  //     icon: Clock,
  //     description: "Quizzes in the last 7 days",
  //     trend: "-1 from last week",
  //     trendUp: false,
  //   },
  //   {
  //     title: "Average Score",
  //     value: "78%",
  //     icon: BarChart,
  //     description: "Across all quizzes",
  //     trend: "+5% improvement",
  //     trendUp: true,
  //   },
  // ];

  // Mock data for recent quizzes
  // const recentQuizzes = [
  //   {
  //     id: "1",
  //     title: "Introduction to Biology",
  //     topic: "Science",
  //     questions: 15,
  //     createdAt: "2023-05-15",
  //     submissions: 24,
  //     avgScore: 85,
  //   },
  //   {
  //     id: "2",
  //     title: "World History: Ancient Civilizations",
  //     topic: "History",
  //     questions: 20,
  //     createdAt: "2023-05-10",
  //     submissions: 18,
  //     avgScore: 72,
  //   },
  //   {
  //     id: "3",
  //     title: "Algebra Fundamentals",
  //     topic: "Mathematics",
  //     questions: 12,
  //     createdAt: "2023-05-05",
  //     submissions: 32,
  //     avgScore: 68,
  //   },
  // ];

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your quizzes today.
            </p>
          </div>
          <Button asChild className="shadow-sm">
            <Link href="/teacher/quizzes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="overflow-hidden border-none shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent -z-10" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.trend !== "—" ? (
                    <p
                      className={`text-xs flex items-center ${
                        stat.trendUp ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.trendUp ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingUp className="mr-1 h-3 w-3 transform rotate-180" />
                      )}
                      {stat.trend}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No recent data
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
            <TabsTrigger value="quizzes">Recent Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Quizzes taken and student engagement in the past week
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="quizzes"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>
                    Average student scores by subject
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={performanceData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            {topPerformers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                  <CardDescription>
                    Students with the highest scores across all quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {topPerformers.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium capitalize">
                            {student?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student?.avgScore} Average
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          {/* <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Completion Rates</CardTitle>
                <CardDescription>
                  Percentage of students who completed each quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Introduction to Biology</div>
                      <div className="text-sm text-muted-foreground">
                        24/30 students completed
                      </div>
                    </div>
                    <div className="text-sm font-medium">80%</div>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        World History: Ancient Civilizations
                      </div>
                      <div className="text-sm text-muted-foreground">
                        18/25 students completed
                      </div>
                    </div>
                    <div className="text-sm font-medium">72%</div>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Algebra Fundamentals</div>
                      <div className="text-sm text-muted-foreground">
                        32/35 students completed
                      </div>
                    </div>
                    <div className="text-sm font-medium">91%</div>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Chemistry Basics</div>
                      <div className="text-sm text-muted-foreground">
                        15/28 students completed
                      </div>
                    </div>
                    <div className="text-sm font-medium">54%</div>
                  </div>
                  <Progress value={54} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Question Difficulty</CardTitle>
                  <CardDescription>
                    Questions with highest error rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Biology Quiz, Question 3
                        </div>
                        <div className="text-xs text-muted-foreground">
                          75% incorrect
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Algebra Quiz, Question 7
                        </div>
                        <div className="text-xs text-muted-foreground">
                          68% incorrect
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Chemistry Quiz, Question 5
                        </div>
                        <div className="text-xs text-muted-foreground">
                          62% incorrect
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Time Spent</CardTitle>
                  <CardDescription>
                    Average time spent on quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">Biology Quiz</div>
                        <div className="text-xs font-medium">18:45 minutes</div>
                      </div>
                      <Progress value={75} className="h-2 mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">
                          World History Quiz
                        </div>
                        <div className="text-xs font-medium">24:12 minutes</div>
                      </div>
                      <Progress value={96} className="h-2 mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">Algebra Quiz</div>
                        <div className="text-xs font-medium">15:30 minutes</div>
                      </div>
                      <Progress value={62} className="h-2 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}
          <TabsContent value="quizzes" className="space-y-4">
            {recentQuizzes?.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary/10 p-6 md:w-1/4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {quiz.topic}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {quiz.questions} Questions
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:w-3/4 flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-muted-foreground">
                            Date Created
                          </div>
                          <div className="mt-1 font-medium">
                            {quiz.createdAt}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-muted-foreground">
                            Submissions
                          </div>
                          <div className="mt-1 font-medium">
                            {quiz.submissions} students
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-muted-foreground">
                            Average Score
                          </div>
                          <div
                            className={`mt-1 font-medium flex items-center ${
                              quiz.avgScore >= 80
                                ? "text-green-500"
                                : quiz.avgScore >= 60
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {quiz.avgScore}%
                            {quiz.avgScore >= 80 && (
                              <CheckCircle2 className="h-4 w-4 ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-start mt-auto">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/quizzes/${quiz.id}/results`}>
                            Results
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/quizzes/${quiz.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="text-center mt-4">
              <Button asChild variant="outline">
                <Link href="/teacher/quizzes">View All Quizzes</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-purple-100/20 dark:from-primary/10 dark:to-purple-900/10 hover:shadow-md transition-shadow border-none shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Create New Quiz</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a new quiz for your students with multiple choice
                  questions
                </p>
                <Button asChild className="mt-auto">
                  <Link href="/teacher/quizzes/create">Create Quiz</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-primary/5 to-blue-100/20 dark:from-primary/10 dark:to-blue-900/10 hover:shadow-md transition-shadow border-none shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Manage Students</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage all your students and their progress
                </p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href="/teacher/students">View Students</Link>
                </Button>
              </CardContent>
            </Card>
            {/* <Card className="bg-gradient-to-br from-primary/5 to-green-100/20 dark:from-primary/10 dark:to-green-900/10 hover:shadow-md transition-shadow border-none shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">View Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get detailed insights on quiz performance and student progress
                </p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href="/teacher/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
