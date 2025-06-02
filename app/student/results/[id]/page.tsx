"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function QuizResultDetailPage() {
  const { id } = useParams(); // quiz id from URL
  const router = useRouter();

  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/quiz/student/result/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("🚀 ~ fetchQuizDetails ~ response:", response);
        setResultData(response.data);
      } catch (error: any) {
        console.error("Error fetching quiz details:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to fetch result details",
          variant: "destructive",
        });
        router.push("/student/dashboard"); // Redirect back if error
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, router]);

  // Function to format markdown-like feedback text
  const formatFeedback = (feedback: string) => {
    if (!feedback) return null;

    return feedback.split("\n").map((line, index) => {
      // Handle headers (###, ####)
      if (line.startsWith("#### ")) {
        return (
          <h4
            key={index}
            className="font-semibold text-lg mt-4 mb-2 text-blue-600 dark:text-blue-400"
          >
            {line.replace("#### ", "")}
          </h4>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="font-bold text-xl mt-6 mb-3 text-blue-700 dark:text-blue-300"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }

      // Handle bold text (**text**)
      if (line.includes("**")) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <p key={index} className="mb-2 leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong
                    key={partIndex}
                    className="font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      }

      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={index} className="ml-4 mb-1 list-decimal list-inside">
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      }

      // Handle bullet points (-)
      if (line.trim().startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1 list-disc list-inside">
            {line.replace(/^\s*-\s*/, "")}
          </li>
        );
      }

      // Regular paragraphs
      if (line.trim() === "") {
        return <br key={index} />;
      }

      return (
        <p key={index} className="mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading result details...</div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">No result found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Score Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results: {resultData.title}</CardTitle>
          <CardDescription>
            Here is your detailed performance breakdown.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <div className="text-5xl font-bold mb-2">{resultData.score}</div>
            <p className="text-muted-foreground">
              You answered {resultData.correctAnswers} out of{" "}
              {resultData.totalQuestions} questions correctly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Question Summary</h3>
            {resultData.questions.map((question: any, index: number) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <span
                    className={
                      question.isCorrect
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {question.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <p className="mt-2">{question.questionText}</p>
                <div className="mt-2 space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">Your answer:</span>{" "}
                    {question.studentAnswer}
                  </div>
                  {!question.isCorrect && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      <span className="font-medium">Correct answer:</span>{" "}
                      {question.correctAnswer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      {resultData.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-blue-600">📝</span>
              Personalized Feedback
            </CardTitle>
            <CardDescription>
              Detailed feedback to help you improve your understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {formatFeedback(resultData.feedback)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Return Button */}
      <Card>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/student/dashboard">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
