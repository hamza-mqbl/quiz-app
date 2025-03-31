"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Clock, Award, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import StudentLayout from "@/components/student-layout"

export default function StudentDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/signin")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div>Loading...</div>
  }

  // Mock data for dashboard
  const stats = [
    {
      title: "Quizzes Taken",
      value: "8",
      icon: BookOpen,
      description: "Across all subjects",
    },
    {
      title: "Average Score",
      value: "82%",
      icon: Award,
      description: "Your performance",
    },
    {
      title: "Last Quiz",
      value: "2 days ago",
      icon: Clock,
      description: "World History",
    },
  ]

  // Mock data for available quizzes
  const availableQuizzes = [
    {
      id: "1",
      title: "Introduction to Biology",
      topic: "Science",
      questions: 15,
      teacher: "Dr. Smith",
      timeLimit: "30 min",
    },
    {
      id: "2",
      title: "World History: Ancient Civilizations",
      topic: "History",
      questions: 20,
      teacher: "Prof. Johnson",
      timeLimit: "45 min",
    },
    {
      id: "3",
      title: "Algebra Fundamentals",
      topic: "Mathematics",
      questions: 12,
      teacher: "Ms. Williams",
      timeLimit: "25 min",
    },
  ]

  // Mock data for recent results
  const recentResults = [
    {
      id: "1",
      title: "Chemistry Basics",
      score: "85%",
      date: "2023-05-12",
      status: "passed",
    },
    {
      id: "2",
      title: "English Literature: Shakespeare",
      score: "78%",
      date: "2023-05-08",
      status: "passed",
    },
    {
      id: "3",
      title: "Geography: World Capitals",
      score: "92%",
      date: "2023-05-01",
      status: "passed",
    },
  ]

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here&apos;s your learning progress.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Quizzes</h2>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search quizzes..." className="pl-8" />
            </div>
          </div>
          <div className="space-y-4">
            {availableQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground mt-1">
                        <div>Topic: {quiz.topic}</div>
                        <div>Questions: {quiz.questions}</div>
                        <div>Teacher: {quiz.teacher}</div>
                        <div>Time Limit: {quiz.timeLimit}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start">
                      <Button asChild>
                        <Link href={`/student/quizzes/${quiz.id}`}>Start Quiz</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
          <div className="space-y-4">
            {recentResults.map((result) => (
              <Card key={result.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{result.title}</h3>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground mt-1">
                        <div>Date: {result.date}</div>
                        <div
                          className={`font-medium ${
                            Number.parseInt(result.score) >= 80
                              ? "text-green-600 dark:text-green-400"
                              : Number.parseInt(result.score) >= 60
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          Score: {result.score}
                        </div>
                        <div
                          className={`capitalize ${
                            result.status === "passed"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          Status: {result.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/results/${result.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

