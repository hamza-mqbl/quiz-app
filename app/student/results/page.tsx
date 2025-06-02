"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Search,
  Download,
  TrendingUp,
  BarChart3,
  Eye,
  FileText,
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface QuizResult {
  id: string;
  quizId: string;
  title: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: string;
  completedAt: string;
  status: "passed" | "failed";
  teacher: string;
  difficulty: "easy" | "medium" | "hard";
  passingScore: number;
}

export default function StudentResults() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [results, setResults] = useState<QuizResult[]>([]);
  console.log("🚀 ~ StudentResults ~ results:", results);
  const [filteredResults, setFilteredResults] = useState<QuizResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/student/recent-results`,
          {
            withCredentials: true,
          }
        );
        console.log("🚀 ~ fetchResults ~ response:", response);

        // Transform the API response to match our interface
        const transformedResults = response.data.results.map((result: any) => ({
          id: result.id,
          quizId: result.id,
          title: result.title,
          topic: result.topic || "General",
          score: parseInt(result.score), // ✅ parse score to number
          totalQuestions: result.totalQuestions || 10,
          correctAnswers: result.correctAnswers,
          timeSpent: result.timeSpent || "N/A",
          completedAt: new Date(
            result.completedAt || result.createdAt
          ).toLocaleDateString(),
          status:
            parseInt(result.score) >= (result.passingScore || 60)
              ? "passed"
              : "failed",
          teacher: result.teacher || "Unknown Teacher",
          passingScore: result.passingScore || 60,
        }));

        setResults(transformedResults);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz results",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [user, toast]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // Filter and sort results
  useEffect(() => {
    const filtered = results.filter((result) => {
      const matchesSearch =
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.teacher.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTopic =
        topicFilter === "all" || result.topic === topicFilter;
      const matchesStatus =
        statusFilter === "all" || result.status === statusFilter;

      return matchesSearch && matchesTopic && matchesStatus;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime()
          );
        case "score-desc":
          return b.score - a.score;
        case "score-asc":
          return a.score - b.score;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, topicFilter, statusFilter, sortBy]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  // Calculate statistics
  const totalQuizzes = results.length;
  const passedQuizzes = results.filter((r) => r.status === "passed").length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / totalQuizzes)
      : 0;
  const bestScore =
    totalQuizzes > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  const uniqueTopics = [...new Set(results.map((r) => r.topic))];

  const handleExport = async (format: string) => {
    try {
      toast({
        title: "Exporting...",
        description: `Preparing ${format.toUpperCase()} export`,
      });

      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Export Complete",
        description: `Results exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export results",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
            <p className="text-muted-foreground">
              Track your quiz performance and progress over time
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quizzes
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                Across {uniqueTopics.length} subjects
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
              >
                {averageScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(bestScore)}`}>
                {bestScore}%
              </div>
              <p className="text-xs text-muted-foreground">Personal best</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by quiz title, topic, or teacher..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {uniqueTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Latest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="score-desc">Highest Score</SelectItem>
                  <SelectItem value="score-asc">Lowest Score</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm ||
                topicFilter !== "all" ||
                statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setTopicFilter("all");
                    setStatusFilter("all");
                  }}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredResults.length} of {totalQuizzes} results
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <Card
                key={result.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          {result.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              result.status === "passed"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {result.status === "passed" ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Teacher:</span>{" "}
                          {result.teacher}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <div
                          className={`font-semibold ${getScoreColor(
                            result.score
                          )}`}
                        >
                          Score: {result.score}
                        </div>
                        <div>
                          Correct:{" "}
                          {`${
                            isNaN(result?.correctAnswers)
                              ? 1
                              : result.correctAnswers
                          }/${
                            isNaN(result?.totalQuestions)
                              ? 0
                              : result.totalQuestions
                          }`}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 self-start">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/results/${result.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || topicFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "You haven't taken any quizzes yet. Start with your first quiz!"}
                </p>
                {!searchTerm &&
                  topicFilter === "all" &&
                  statusFilter === "all" && (
                    <Button asChild>
                      <Link href="/student/quizzes">
                        Browse Available Quizzes
                      </Link>
                    </Button>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
