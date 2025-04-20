"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import StudentLayout from "@/components/student-layout";

// Form schema
const formSchema = z.object({
  answers: z.record(z.string()),
});

type QuizFormValues = z.infer<typeof formSchema>;

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [quizData, setQuizData] = useState<any>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizCodeInput, setShowQuizCodeInput] = useState(true);
  const [quizCodeInput, setQuizCodeInput] = useState("");

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your quiz has been automatically submitted.",
      variant: "destructive",
    });
    handleSubmitQuiz();
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setShowQuizCodeInput(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  const handleSubmitQuiz = async () => {
    try {
      const answersObj = form.getValues().answers;
      const answersArray = quizData.questions.map(
        (q: any) => answersObj[q._id] || ""
      ); // maintain order

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/submit/${quizData._id}`,
        { answers: answersArray },
        { withCredentials: true } // ✅ important to send student cookie (user_token)
      );

      const { score } = response.data;
      setScore(score);
      setQuizSubmitted(true);
      toast({ title: "Quiz submitted successfully!" });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to submit quiz",
        description: error?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleQuizCodeSubmit = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/join/${quizCodeInput}`
      );
      const quiz = response.data.quiz;
      setQuizData(quiz);
      setTimeLeft(30 * 60); // 30 min (you can make it dynamic later)
      startQuiz();
      toast({ title: "Quiz loaded successfully!" });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Invalid Quiz Code",
        description:
          error?.response?.data?.message || "Please enter a valid code",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Quiz Code Popup */}
        {showQuizCodeInput && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Quiz Code</CardTitle>
              <CardDescription>
                Please enter the quiz code provided by your teacher to join the
                quiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter Quiz Code..."
                value={quizCodeInput}
                onChange={(e) => setQuizCodeInput(e.target.value)}
              />
              <Button className="w-full" onClick={handleQuizCodeSubmit}>
                Join Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* If quiz not started yet */}
        {quizStarted && quizData && !quizSubmitted && (
          <>
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold">{quizData.title}</h1>
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </span>
                <span>
                  {Math.round(
                    ((currentQuestion + 1) / quizData.questions.length) * 100
                  )}
                  % Complete
                </span>
              </div>
              <Progress
                value={
                  ((currentQuestion + 1) / quizData.questions.length) * 100
                }
              />
            </div>

            {/* Quiz Form */}
            <Form {...form}>
              <form className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Question {currentQuestion + 1}</CardTitle>
                    <CardDescription>
                      {quizData.questions[currentQuestion].questionText}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={`answers.${quizData.questions[currentQuestion]._id}`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              {quizData.questions[currentQuestion].options.map(
                                (option: string, idx: number) => (
                                  <FormItem
                                    key={idx}
                                    className="flex items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={option} />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {option}
                                    </FormLabel>
                                  </FormItem>
                                )
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    {currentQuestion < quizData.questions.length - 1 ? (
                      <Button type="button" onClick={nextQuestion}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleSubmitQuiz}>
                        Submit Quiz
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </>
        )}

        {/* After quiz submitted */}
        {quizSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>Your score is ready!</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-5xl font-bold">{Math.round(score)}%</div>
              <p className="text-muted-foreground">
                You answered{" "}
                {Math.round((score / 100) * quizData.questions.length)} out of{" "}
                {quizData.questions.length} correctly.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/student/dashboard">Back to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
