"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeacherLayout from "@/components/teacher-layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast"; // ✅ Import toast (you already have it)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TeacherQuizzes() {
  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/quiz/my-quizzes`, {
        withCredentials: true,
      });

      const data = response.data.quizzes.map((quiz: any) => ({
        id: quiz._id,
        title: quiz.title,
        topic: quiz.topic,
        questions: quiz.questions.length,
        createdAt: new Date(quiz.createdAt).toLocaleDateString(),
        submissions: quiz.submissions.length,
        status: quiz.isPublished ? "published" : "draft",
        resultsPublished: quiz.resultsPublished || false, // ✅ ADD THIS
      }));

      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const publishQuiz = async (quizId: string) => {
    try {
      await axios.put(
        `${API_URL}/api/quiz/publish/${quizId}`,
        {},
        { withCredentials: true }
      );
      toast({
        title: "Quiz Published",
        description: "Your quiz has been published successfully.",
      });
      fetchQuizzes();
    } catch (error: any) {
      console.error("Publish quiz failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to publish quiz.",
        variant: "destructive",
      });
    }
  };

  const publishResults = async (quizId: string) => {
    try {
      await axios.put(
        `${API_URL}/api/quiz/publish-result/${quizId}`,
        {},
        { withCredentials: true }
      );
      toast({
        title: "Results Published",
        description: "Quiz results have been published successfully.",
      });
      fetchQuizzes();
    } catch (error: any) {
      console.error("Publish result failed:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to publish results.",
        variant: "destructive",
      });
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = topicFilter === "all" || quiz.topic === topicFilter;
    const matchesStatus =
      statusFilter === "all" || quiz.status === statusFilter;

    return matchesSearch && matchesTopic && matchesStatus;
  });

  const topics = [
    "all",
    ...Array.from(new Set(quizzes.map((quiz) => quiz.topic))),
  ];

  return (
    <TeacherLayout>
      {/* Top section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
            <p className="text-muted-foreground">
              Manage and organize all your quizzes
            </p>
          </div>
          <Button asChild>
            <Link href="/teacher/quizzes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        {/* Filters */}
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

        {/* Quizzes List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length > 0 ? (
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

                    {/* Actions */}
                    <div className="flex gap-2 self-start flex-wrap justify-center items-center">
                      {quiz.status === "draft" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => publishQuiz(quiz.id)}
                        >
                          Publish Quiz
                        </Button>
                      )}
                      {quiz.status === "published" && (
                        <>
                          {quiz.resultsPublished ? (
                            <span className="text-green-600 font-medium text-sm">
                              Result Published
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => publishResults(quiz.id)}
                            >
                              Publish Results
                            </Button>
                          )}
                        </>
                      )}
                      {quiz.status === "draft" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/quizzes/${quiz.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/quizzes/${quiz.id}`}>View</Link>
                      </Button>
                      {quiz.status === "published" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/quizzes/${quiz.id}/result`}>
                            result
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No quizzes found. Try adjusting your filters or create a new
                quiz.
              </p>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
