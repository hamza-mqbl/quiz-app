"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Clock, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Form schema
const formSchema = z.object({
  answers: z.record(z.string()),
});

type QuizFormValues = z.infer<typeof formSchema>;

const CHEATING_WARNING_THRESHOLD = 3; // Number of tab switches before auto-submission
const FULLSCREEN_CHECK_INTERVAL = 1000; // Check fullscreen status every second

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

  // Anti-cheating state
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  console.log("🚀 ~ TakeQuizPage ~ tabSwitchCount:", tabSwitchCount);
  const [screenSizeViolations, setScreenSizeViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Use refs to track the actual values in event listeners
  const tabSwitchRef = useRef(0);
  const screenSizeViolationsRef = useRef(0);
  const quizSubmittedRef = useRef(false);
  const initialWindowSize = useRef({ width: 0, height: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenInterval = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  // Track timer when quiz is active
  useEffect(() => {
    if (!quizStarted || quizSubmitted || !timeLeft) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, quizSubmitted, timeLeft]);

  // Initialize window size tracking when quiz starts
  useEffect(() => {
    if (quizStarted && !quizSubmitted) {
      initialWindowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  }, [quizStarted, quizSubmitted]);

  // Combined anti-cheating measures
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    quizSubmittedRef.current = quizSubmitted;

    // 1. Visibility change detection (tab switching)
    const handleVisibilityChange = () => {
      if (quizSubmittedRef.current) return;

      if (document.visibilityState === "hidden") {
        tabSwitchRef.current += 1;
        setTabSwitchCount(tabSwitchRef.current);

        showWarningToast(
          "Tab switch detected!",
          `You've switched tabs ${tabSwitchRef.current} time(s) out of ${CHEATING_WARNING_THRESHOLD} allowed.`
        );

        if (tabSwitchRef.current >= CHEATING_WARNING_THRESHOLD) {
          setWarningMessage(
            "You've switched tabs too many times. Your quiz will be submitted automatically."
          );
          setShowWarningDialog(true);
          setTimeout(() => handleSubmitQuiz(), 3000);
        }
      }
    };

    // 2. Window blur/focus detection (switching applications)
    const handleWindowBlur = () => {
      if (quizSubmittedRef.current) return;

      tabSwitchRef.current += 1;
      setTabSwitchCount(tabSwitchRef.current);

      showWarningToast(
        "Application switch detected!",
        `You've switched focus ${tabSwitchRef.current} time(s) out of ${CHEATING_WARNING_THRESHOLD} allowed.`
      );

      if (tabSwitchRef.current >= CHEATING_WARNING_THRESHOLD) {
        setWarningMessage(
          "You've switched applications too many times. Your quiz will be submitted automatically."
        );
        setShowWarningDialog(true);
        setTimeout(() => handleSubmitQuiz(), 3000);
      }
    };

    // 3. Screen resize detection (minimizing or resizing)
    const handleResize = () => {
      if (quizSubmittedRef.current) return;

      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const initialWidth = initialWindowSize.current.width;
      const initialHeight = initialWindowSize.current.height;

      // If window size has changed significantly (by more than 20%)
      if (
        currentWidth < initialWidth * 0.8 ||
        currentHeight < initialHeight * 0.8
      ) {
        screenSizeViolationsRef.current += 1;
        setScreenSizeViolations(screenSizeViolationsRef.current);

        showWarningToast(
          "Window resize detected!",
          `You've resized or minimized the window ${screenSizeViolationsRef.current} time(s).`
        );

        if (screenSizeViolationsRef.current >= CHEATING_WARNING_THRESHOLD) {
          setWarningMessage(
            "You've resized or minimized the window too many times. Your quiz will be submitted automatically."
          );
          setShowWarningDialog(true);
          setTimeout(() => handleSubmitQuiz(), 3000);
        }
      }
    };

    // 4. Check fullscreen exits
    const setupFullscreenDetection = () => {
      const checkFullscreen = () => {
        const isDocFullscreen =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement;

        if (!isDocFullscreen && isFullscreen) {
          setIsFullscreen(false);
          screenSizeViolationsRef.current += 1;
          setScreenSizeViolations(screenSizeViolationsRef.current);

          showWarningToast(
            "Fullscreen exit detected!",
            `You've exited fullscreen mode ${screenSizeViolationsRef.current} time(s).`
          );

          if (screenSizeViolationsRef.current >= CHEATING_WARNING_THRESHOLD) {
            setWarningMessage(
              "You've exited fullscreen mode too many times. Your quiz will be submitted automatically."
            );
            setShowWarningDialog(true);
            setTimeout(() => handleSubmitQuiz(), 3000);
          }
        } else if (isDocFullscreen && !isFullscreen) {
          setIsFullscreen(true);
        }
      };

      fullscreenInterval.current = setInterval(
        checkFullscreen,
        FULLSCREEN_CHECK_INTERVAL
      );
    };

    // 5. Copy/paste detection
    const handleCopyPaste = (e: Event) => {
      e.preventDefault();
      showWarningToast(
        "Copy/paste detected!",
        "Copy and paste are not allowed during the quiz."
      );
    };

    // 6. Right-click/context menu prevention
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      showWarningToast(
        "Right-click detected!",
        "Right-click is disabled during the quiz."
      );
    };

    // 7. Print prevention
    const handleBeforePrint = () => {
      showWarningToast(
        "Print attempt detected!",
        "Printing is not allowed during the quiz."
      );
    };

    // Set up all event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("resize", handleResize);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeprint", handleBeforePrint);

    setupFullscreenDetection();

    // Request fullscreen if supported
    const tryEnterFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
            showWarningToast(
              "Fullscreen mode",
              "Please stay in fullscreen mode for the duration of the quiz.",
              "info"
            );
          })
          .catch((err) => {
            console.error("Failed to enter fullscreen:", err);
          });
      }
    };

    // Try to enter fullscreen when quiz starts
    tryEnterFullscreen();

    // Clean up all event listeners and intervals
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeprint", handleBeforePrint);

      if (fullscreenInterval.current) {
        clearInterval(fullscreenInterval.current);
      }

      // Exit fullscreen on cleanup if we're in it
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
    };
  }, [quizStarted, quizSubmitted, isFullscreen]);
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        console.log("triger");
        event.preventDefault();
        showWarningToast(
          "Keyboard navigation detected!",
          "Tab/Shift+Tab navigation is not allowed during the quiz."
        );
        tabSwitchRef.current += 1;
        setTabSwitchCount(tabSwitchRef.current);

        if (
          tabSwitchRef.current + screenSizeViolationsRef.current >=
          CHEATING_WARNING_THRESHOLD
        ) {
          setWarningMessage(
            "You used restricted keys too many times. The quiz will now be submitted."
          );
          setShowWarningDialog(true);
          setTimeout(() => handleSubmitQuiz(), 3000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [quizStarted, quizSubmitted]);

  const showWarningToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "info" = "destructive"
  ) => {
    toast({
      title,
      description,
      variant: variant as any,
    });
  };

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
    if (quizSubmittedRef.current) return; // Prevent multiple submissions

    quizSubmittedRef.current = true;

    try {
      const answersObj = form.getValues().answers;
      // Ensure all questions have an answer, default to "" if unanswered
      const answersArray = quizData.questions.map(
        (q: any) => answersObj[q._id] || "" // Default to empty string if no answer
      );

      console.log("Submitting answers:", answersArray); // Debug log

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/submit/${quizData._id}`,
        { answers: answersArray },
        { withCredentials: true }
      );
      setQuizSubmitted(true);

      const { score, feedback } = response.data;
      console.log("🚀 ~ handleSubmitQuiz ~ feedback:", feedback);
      setScore(score);
      toast({ title: "Quiz submitted successfully!" });

      // Clean up any timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (fullscreenInterval.current) clearInterval(fullscreenInterval.current);

      // Exit fullscreen if needed
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to submit quiz",
        description: error?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });

      // Still mark as submitted to prevent further anti-cheat warnings
      setQuizSubmitted(true);
    }
  };

  const handleQuizCodeSubmit = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/join/${quizCodeInput}`
      );
      const quiz = response.data.quiz;
      setQuizData(quiz);
      setTimeLeft(quiz.timeLimit || 30 * 60); // Use quiz time limit if available, otherwise default to 30 min
      startQuiz();
      toast({
        title: "Quiz loaded successfully!",
        description:
          "The quiz will now start in fullscreen mode. Please do not exit fullscreen, switch tabs, or resize the window.",
      });
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
        {/* Warning Dialog */}
        {showWarningDialog && (
          <AlertDialog
            open={showWarningDialog}
            onOpenChange={setShowWarningDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Quiz Violation Detected
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {warningMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowWarningDialog(false)}>
                  Understand
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Quiz Code Input */}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleQuizCodeSubmit();
                  }
                }}
              />
              <Button className="w-full" onClick={handleQuizCodeSubmit}>
                Join Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Active Quiz */}
        {quizStarted && quizData && !quizSubmitted && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{quizData.title}</h1>
              <div className="flex items-center gap-4">
                {tabSwitchCount > 0 && (
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Violations: {tabSwitchCount + screenSizeViolations}/
                    {CHEATING_WARNING_THRESHOLD}
                  </div>
                )}
                <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
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

        {/* Quiz Results */}
        {quizSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Submitted</CardTitle>
              <CardDescription>
                Your answers have been submitted successfully!
              </CardDescription>
            </CardHeader>
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
