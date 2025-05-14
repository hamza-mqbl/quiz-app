"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Trash2,
  Plus,
  Save,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import TeacherLayout from "@/components/teacher-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  description: z.string().optional(),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(2, {
          message: "Question must be at least 2 characters.",
        }),
        options: z
          .array(
            z.string().min(1, {
              message: "Option cannot be empty.",
            })
          )
          .min(2, {
            message: "At least 2 options are required.",
          }),
        correctAnswer: z.string().min(1, {
          message: "Please select a correct answer.",
        }),
      })
    )
    .min(1, {
      message: "At least one question is required.",
    }),
});

type QuizFormValues = z.infer<typeof formSchema>;

export default function EditQuizPage({ params }: { params: { id: string } }) {
  // const quizId = params.id;
  const { id: quizId } = useParams();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      topic: "",
      description: "",
      questions: [
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/get-my-quiz/${quizId}`,
          {
            withCredentials: true,
          }
        );

        const quizData = response.data.quiz;

        // Check if the quiz is published
        setIsPublished(quizData.isPublished);

        // Format the data for the form
        const formattedData = {
          title: quizData.title,
          topic: quizData.topic,
          description: quizData.description || "",
          questions: quizData.questions.map((q: any) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        };

        // Reset form with the fetched data
        form.reset(formattedData);
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
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, form]);

  const onSubmit = async (values: QuizFormValues) => {
    try {
      setIsSaving(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/update-my-quiz/${quizId}`,
        values,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Quiz updated successfully!",
        });
        router.push("/teacher/quizzes");
      }
    } catch (error) {
      console.error("Failed to update quiz:", error);
      toast({
        title: "Error",
        description: "Failed to update quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setDeleteQuestionId(index);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuestion = () => {
    if (deleteQuestionId !== null) {
      remove(deleteQuestionId);
    }
    setDeleteDialogOpen(false);
  };

  const handleAddOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    const updatedOptions = [...currentOptions, ""];
    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    if (currentOptions.length <= 2) {
      toast({
        title: "Cannot Remove Option",
        description: "A question must have at least 2 options.",
        variant: "destructive",
      });
      return;
    }

    // Check if we're removing the correct answer
    const correctAnswer = form.getValues(
      `questions.${questionIndex}.correctAnswer`
    );
    const optionToRemove = currentOptions[optionIndex];

    const updatedOptions = currentOptions.filter(
      (_, index) => index !== optionIndex
    );
    form.setValue(`questions.${questionIndex}.options`, updatedOptions);

    // If we removed the correct answer, reset it
    if (correctAnswer === optionToRemove) {
      form.setValue(`questions.${questionIndex}.correctAnswer`, "");
    }
  };

  if (isLoading) {
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
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
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

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
              {isPublished && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                >
                  Published
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Update your quiz content and questions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/teacher/quizzes")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                <CardDescription>
                  Update the basic information about your quiz.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduction to Biology"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The title of your quiz as it will appear to students.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Science, Mathematics, History, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The subject or topic this quiz covers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a brief description of this quiz..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional information about the quiz for your students.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Questions</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    append({
                      questionText: "",
                      options: ["", "", "", ""],
                      correctAnswer: "",
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="border border-muted">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-muted/30">
                    <div>
                      <CardTitle className="text-lg">
                        Question {index + 1}
                      </CardTitle>
                      <CardDescription>
                        Edit this multiple-choice question.
                      </CardDescription>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove question</span>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.questionText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your question here..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel>Options</FormLabel>
                      {[0, 1, 2, 3].map((optionIndex) => (
                        <FormField
                          key={optionIndex}
                          control={form.control}
                          name={`questions.${index}.options.${optionIndex}`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <FormControl>
                                  <Input
                                    placeholder={`Option ${optionIndex + 1}`}
                                    {...field}
                                    className="flex-1"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <FormField
                      control={form.control}
                      name={`questions.${index}.correctAnswer`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Correct Answer</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-2"
                            >
                              {form
                                .getValues(`questions.${index}.options`)
                                .map((option, optionIndex) => {
                                  if (!option) return null;
                                  return (
                                    <FormItem
                                      key={optionIndex}
                                      className="flex items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <RadioGroupItem value={option} />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                })}
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            Select the correct answer for this question.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  {index < fields.length - 1 && <Separator />}
                </Card>
              ))}
            </div>

            <Card>
              <CardFooter className="flex justify-between py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/teacher/quizzes")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete Question{" "}
                {deleteQuestionId !== null ? deleteQuestionId + 1 : ""} from
                your quiz. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteQuestion}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TeacherLayout>
  );
}
