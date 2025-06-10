"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, Award, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import StudentLayout from "@/components/student-layout";
import axios from "axios";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  console.log(
    "🚀 ~ StudentDashboard ~ availableQuizzes,,,,,,,,,,,,,,,,:",
    availableQuizzes
  );
  const [recentResults, setRecentResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchAvailableQuizzes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/all-quize`,
          { withCredentials: true }
        );
        console.log("🚀 ~ fetchAvailableQuizzes ~ response:", response);
        const quizzes = response.data.quizzes.map((quiz: any) => ({
          id: quiz._id,
          title: quiz.title,
          topic: quiz.topic,
          questions: quiz.questions.length,
          teacher: quiz.createdBy?.name || "Unknown Teacher",
          QuizCode: quiz?.quizCode,
          timeLimit: quiz?.timeLimit + "min" || "20 min",
        }));
        setAvailableQuizzes(quizzes);
      } catch (error) {
        console.error("Failed to fetch available quizzes:", error);
      }
    };

    const fetchRecentResults = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/student/recent-results`,
          { withCredentials: true }
        );
        setRecentResults(response.data.results);
      } catch (error) {
        console.error("Failed to fetch recent results:", error);
      }
    };

    fetchAvailableQuizzes();
    fetchRecentResults();
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: "Quizzes Taken",
      value: recentResults.length.toString(),
      icon: BookOpen,
      description: "Across all subjects",
    },
    {
      title: "Average Score",
      value:
        recentResults.length > 0
          ? `${Math.round(
              recentResults.reduce((acc, cur) => acc + parseInt(cur.score), 0) /
                recentResults.length
            )}%`
          : "0%",
      icon: Award,
      description: "Your performance",
    },
    {
      title: "Last Quiz",
      value: recentResults[0]?.date || "No Quiz Yet",
      icon: Clock,
      description: recentResults[0]?.title || "-",
    },
  ];

  const filteredAvailableQuizzes = availableQuizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's your learning progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Quizzes</h2>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredAvailableQuizzes.length > 0 ? (
              filteredAvailableQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-muted-foreground mt-1">
                          <div>Topic: {quiz.topic}</div>
                          <div>Questions: {quiz.questions}</div>
                          <div>QuizCode: {quiz.QuizCode}</div>
                          <div>Time Limit: {quiz.timeLimit}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-start">
                        <Button asChild>
                          <Link href={`/student/quizzes/${quiz.id}`}>
                            Start Quiz
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No quizzes available right now. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
          <div className="space-y-4">
            {recentResults.length > 0 ? (
              recentResults.map((result) => (
                <Card key={result.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {result.title}
                        </h3>
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
                          <Link href={`/student/results/${result.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No recent results available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
