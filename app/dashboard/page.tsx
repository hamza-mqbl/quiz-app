import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Users, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  // Mock data for dashboard
  const stats = [
    {
      title: "Total Quizzes",
      value: "12",
      icon: BookOpen,
      description: "Across all subjects",
    },
    {
      title: "Active Students",
      value: "156",
      icon: Users,
      description: "Students who took quizzes",
    },
    {
      title: "Recent Activity",
      value: "3",
      icon: Clock,
      description: "Quizzes in the last 7 days",
    },
  ]

  // Mock data for recent quizzes
  const recentQuizzes = [
    {
      id: "1",
      title: "Introduction to Biology",
      topic: "Science",
      questions: 15,
      createdAt: "2023-05-15",
      submissions: 24,
    },
    {
      id: "2",
      title: "World History: Ancient Civilizations",
      topic: "History",
      questions: 20,
      createdAt: "2023-05-10",
      submissions: 18,
    },
    {
      id: "3",
      title: "Algebra Fundamentals",
      topic: "Mathematics",
      questions: 12,
      createdAt: "2023-05-05",
      submissions: 32,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your quizzes.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create-quiz">
            <Plus className="mr-2 h-4 w-4" />
            Create New Quiz
          </Link>
        </Button>
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
        <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
        <div className="space-y-4">
          {recentQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground mt-1">
                      <div>Topic: {quiz.topic}</div>
                      <div>Questions: {quiz.questions}</div>
                      <div>Created: {quiz.createdAt}</div>
                      <div>Submissions: {quiz.submissions}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/edit-quiz/${quiz.id}`}>Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/view-quiz/${quiz.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

