"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TeacherLayout from "@/components/teacher-layout"

// Mock data for quizzes
const mockQuizzes = [
  {
    id: "1",
    title: "Introduction to Biology",
    topic: "Science",
    questions: 15,
    createdAt: "2023-05-15",
    submissions: 24,
    status: "published",
  },
  {
    id: "2",
    title: "World History: Ancient Civilizations",
    topic: "History",
    questions: 20,
    createdAt: "2023-05-10",
    submissions: 18,
    status: "published",
  },
  {
    id: "3",
    title: "Algebra Fundamentals",
    topic: "Mathematics",
    questions: 12,
    createdAt: "2023-05-05",
    submissions: 32,
    status: "published",
  },
  {
    id: "4",
    title: "Chemistry Basics",
    topic: "Science",
    questions: 18,
    createdAt: "2023-04-28",
    submissions: 15,
    status: "published",
  },
  {
    id: "5",
    title: "English Literature: Shakespeare",
    topic: "Literature",
    questions: 25,
    createdAt: "2023-04-20",
    submissions: 22,
    status: "draft",
  },
  {
    id: "6",
    title: "Geography: World Capitals",
    topic: "Geography",
    questions: 30,
    createdAt: "2023-04-15",
    submissions: 0,
    status: "draft",
  },
]

export default function TeacherQuizzes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [topicFilter, setTopicFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter quizzes based on search term and filters
  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = topicFilter === "all" || quiz.topic === topicFilter
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter

    return matchesSearch && matchesTopic && matchesStatus
  })

  // Get unique topics for filter
  const topics = ["all", ...Array.from(new Set(mockQuizzes.map((quiz) => quiz.topic)))]

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
            <p className="text-muted-foreground">Manage and organize all your quizzes</p>
          </div>
          <Button asChild>
            <Link href="/teacher/quizzes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic === "all" ? "All Topics" : topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            quiz.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {quiz.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground mt-1">
                        <div>Topic: {quiz.topic}</div>
                        <div>Questions: {quiz.questions}</div>
                        <div>Created: {quiz.createdAt}</div>
                        <div>Submissions: {quiz.submissions}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/quizzes/${quiz.id}/edit`}>Edit</Link>
                      </Button>
                      {quiz.status === "published" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/quizzes/${quiz.id}/results`}>Results</Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/quizzes/${quiz.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No quizzes found. Try adjusting your filters or create a new quiz.
              </p>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  )
}

