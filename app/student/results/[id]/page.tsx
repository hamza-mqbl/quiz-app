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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
          `${API_URL}/quiz/student/result/${id}`,
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

  if (loading) {
    return <div>Loading result details...</div>;
  }

  if (!resultData) {
    return <div>No result found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
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
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/student/dashboard">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
