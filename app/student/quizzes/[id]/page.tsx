"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Clock, ArrowRight, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import StudentLayout from "@/components/student-layout"

// Mock quiz data
const mockQuiz = {
  id: "1",
  title: "Introduction to Biology",
  topic: "Science",
  description: "Test your knowledge of basic biology concepts.",
  timeLimit: 30, // in minutes
  questions: [
    {
      id: "q1",
      questionText: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
      correctAnswer: "Mitochondria",
    },
    {
      id: "q2",
      questionText: "Which of the following is NOT a type of blood cell?",
      options: ["Red Blood Cell", "White Blood Cell", "Platelet", "Neuron"],
      correctAnswer: "Neuron",
    },
    {
      id: "q3",
      questionText: "What is the process by which plants make their own food?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"],
      correctAnswer: "Photosynthesis",
    },
    {
      id: "q4",
      questionText: "Which organ is responsible for filtering blood?",
      options: ["Liver", "Kidney", "Heart", "Lung"],
      correctAnswer: "Kidney",
    },
    {
      id: "q5",
      questionText: "What is the largest organ in the human body?",
      options: ["Brain", "Liver", "Skin", "Heart"],
      correctAnswer: "Skin",
    },
  ],
}

// Create a schema for the form
const formSchema = z.object({
  answers: z.record(z.string()),
})

type QuizFormValues = z.infer<typeof formSchema>

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit * 60) // Convert to seconds
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Initialize form with default values
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  })

  // Start timer when quiz starts
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizSubmitted])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle time up
  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your quiz has been automatically submitted.",
      variant: "destructive",
    })
    handleSubmitQuiz()
  }

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true)
  }

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Submit the quiz
  const handleSubmitQuiz = () => {
    const answers = form.getValues().answers
    let correctAnswers = 0

    // Calculate score
    mockQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = (correctAnswers / mockQuiz.questions.length) * 100
    setScore(finalScore)
    setQuizSubmitted(true)
  }

  // If not logged in or not a student, show loading
  if (loading || !user) {
    return <div>Loading...</div>
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{mockQuiz.title}</h1>
            <p className="text-muted-foreground">{mockQuiz.description}</p>
          </div>
          {quizStarted && !quizSubmitted && (
            <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {!quizStarted && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Instructions</CardTitle>
              <CardDescription>Please read before starting the quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Time Limit</h3>
                <p className="text-sm text-muted-foreground">
                  You have {mockQuiz.timeLimit} minutes to complete this quiz.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Questions</h3>
                <p className="text-sm text-muted-foreground">
                  This quiz contains {mockQuiz.questions.length} multiple-choice questions.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  You can navigate between questions using the Previous and Next buttons.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Submission</h3>
                <p className="text-sm text-muted-foreground">
                  You can submit the quiz at any time. Unanswered questions will be marked as incorrect.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startQuiz}>Start Quiz</Button>
            </CardFooter>
          </Card>
        )}

        {quizStarted && !quizSubmitted && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Question {currentQuestion + 1} of {mockQuiz.questions.length}
                </span>
                <span>{Math.round(((currentQuestion + 1) / mockQuiz.questions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentQuestion + 1) / mockQuiz.questions.length) * 100} />
            </div>

            <Form {...form}>
              <form className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Question {currentQuestion + 1}</CardTitle>
                    <CardDescription>{mockQuiz.questions[currentQuestion].questionText}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={`answers.${mockQuiz.questions[currentQuestion].id}`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                              {mockQuiz.questions[currentQuestion].options.map((option, index) => (
                                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{option}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    {currentQuestion < mockQuiz.questions.length - 1 ? (
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
          </div>
        )}

        {quizSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>You have completed the quiz. Here are your results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="text-5xl font-bold mb-2">{Math.round(score)}%</div>
                <p className="text-muted-foreground">
                  You answered {Math.round((score / 100) * mockQuiz.questions.length)} out of{" "}
                  {mockQuiz.questions.length} questions correctly.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Question Summary</h3>
                {mockQuiz.questions.map((question, index) => {
                  const userAnswer = form.getValues().answers[question.id] || "Not answered"
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <div key={question.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <span
                          className={
                            isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <p className="mt-2">{question.questionText}</p>
                      <div className="mt-2 space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Your answer:</span> {userAnswer}
                        </div>
                        {!isCorrect && (
                          <div className="text-sm text-green-600 dark:text-green-400">
                            <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/student/dashboard">Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </StudentLayout>
  )
}

