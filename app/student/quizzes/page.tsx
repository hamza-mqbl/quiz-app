"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Users,
  Code,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import StudentLayout from "@/components/student-layout";
import axios from "axios";
import Loading from "./loading";

interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: number;
  teacher: string;
  QuizCode: string;
  timeLimit: string;
  difficulty?: string;
  createdAt?: string;
}

export default function AvailableQuizzes() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // Fetch available quizzes
  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/all-quize`,
          {
            withCredentials: true,
          }
        );

        const quizzesData = response.data.quizzes.map((quiz: any) => ({
          id: quiz._id,
          title: quiz.title,
          topic: quiz.topic,
          questions: quiz.questions.length,
          teacher: quiz.createdBy?.name || "Unknown Teacher",
          QuizCode: quiz?.quizCode,
          timeLimit: "30 min",
          difficulty: quiz.difficulty || "Medium",
          createdAt: quiz.createdAt,
        }));

        setQuizzes(quizzesData);
        setFilteredQuizzes(quizzesData);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  // Filter and sort quizzes
  useEffect(() => {
    const filtered = quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.QuizCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTopic =
        selectedTopic === "all" || quiz.topic === selectedTopic;

      return matchesSearch && matchesTopic;
    });

    // Sort quizzes
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Quiz] || "";
      let bValue: string | number = b[sortBy as keyof Quiz] || "";

      if (sortBy === "questions") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm, selectedTopic, sortBy, sortOrder]);

  if (loading || !user) {
    return <Loading />;
  }

  // Get unique topics for filter
  const topics = Array.from(new Set(quizzes.map((quiz) => quiz.topic)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Available Quizzes
          </h1>
          <p className="text-muted-foreground">
            Discover and take quizzes from your teachers. Test your knowledge
            across different subjects.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quizzes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topics.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Filtered Results
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredQuizzes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.from(new Set(quizzes.map((q) => q.teacher))).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, topic, teacher, or quiz code..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("title");
                  setSortOrder("asc");
                }}
              >
                Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("title");
                  setSortOrder("desc");
                }}
              >
                Title (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("topic");
                  setSortOrder("asc");
                }}
              >
                Topic (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("questions");
                  setSortOrder("desc");
                }}
              >
                Most Questions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("questions");
                  setSortOrder("asc");
                }}
              >
                Least Questions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("teacher");
                  setSortOrder("asc");
                }}
              >
                Teacher (A-Z)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quiz Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredQuizzes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {quiz.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {quiz.teacher}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{quiz.topic}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {quiz.questions} questions • {quiz.timeLimit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Code className="h-4 w-4" />
                      <span className="font-mono">{quiz.QuizCode}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/student/quizzes/${quiz.id}`}>Start Quiz</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedTopic !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No quizzes are available right now. Check back later!"}
            </p>
            {(searchTerm || selectedTopic !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTopic("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
