"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Clock,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherLayout from "@/components/teacher-layout";
import { toast } from "@/components/ui/use-toast";

export default function ViewQuizPage({ params }: { params: { id: string } }) {
  const quizId = params.id;
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/get-my-quiz/${quizId}`,
          {
            withCredentials: true,
          }
        );

        setQuiz(response.data.quiz);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        setError("Failed to load quiz data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load quiz data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-64 mb-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex flex-col items-center text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Failed to Load Quiz</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/teacher/quizzes")}
              >
                Back to Quizzes
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

  if (!quiz) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {quiz.title}
              </h1>
              <Badge variant={quiz.isPublished ? "default" : "secondary"}>
                {quiz.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {quiz.description || "No description provided"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/teacher/quizzes")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quizzes
            </Button>
            <Button asChild>
              <Link href={`/teacher/quizzes/${quizId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Quiz
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Overview</CardTitle>
            <CardDescription>Key information about this quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Questions
                  </div>
                  <div className="text-2xl font-bold">
                    {quiz.questions.length}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Submissions
                  </div>
                  <div className="text-2xl font-bold">
                    {quiz.submissions?.length || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Created
                  </div>
                  <div className="text-2xl font-bold">
                    {formatDate(quiz.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Topic</div>
                <div className="font-medium">{quiz.topic}</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Status</div>
                <Badge variant={quiz.isPublished ? "default" : "secondary"}>
                  {quiz.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Average Score</div>
                <div className="font-medium">
                  {quiz.submissions && quiz.submissions.length > 0
                    ? `${Math.round(
                        quiz.submissions.reduce((acc: number, sub: any) => {
                          const totalQuestions = quiz.questions.length || 1;
                          return acc + (sub.score / totalQuestions) * 100;
                        }, 0) / quiz.submissions.length
                      )}%`
                    : "No submissions yet"}
                </div>
              </div>
              {quiz.submissions && quiz.submissions.length > 0 && (
                <>
                  <div className="pt-2">
                    <Progress
                      value={Math.round(
                        quiz.submissions.reduce((acc: number, sub: any) => {
                          const totalQuestions = quiz.questions.length || 1;
                          return acc + (sub.score / totalQuestions) * 100;
                        }, 0) / quiz.submissions.length
                      )}
                      className="h-2"
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          {quiz.questions.map((question: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                <CardDescription>{question.questionText}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map(
                      (option: string, optionIndex: number) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center p-4 rounded-lg border ${
                            option === question.correctAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-muted"
                          }`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium mr-3">
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <div className="flex-1">{option}</div>
                          {option === question.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground/30" />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardFooter className="flex justify-between py-4">
            <Button
              variant="outline"
              onClick={() => router.push("/teacher/quizzes")}
            >
              Back to Quizzes
            </Button>
            <Button asChild>
              <Link href={`/teacher/quizzes/${quizId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Quiz
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TeacherLayout>
  );
}
