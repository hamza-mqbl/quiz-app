"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Plus, Save } from "lucide-react";

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
import axios from "axios"; // 👈 Import axios at the top

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import TeacherLayout from "@/components/teacher-layout";
import { AuthContext } from "@/components/auth-provider";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
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

  // function onSubmit(values: QuizFormValues) {
  //   setIsSubmitting(true)

  //   // Here you would typically make an API call to save the quiz
  //   console.log(values)

  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsSubmitting(false)
  //     toast({
  //       title: "Quiz Created",
  //       description: "Your quiz has been created successfully.",
  //     })
  //     router.push("/teacher/quizzes")
  //   }, 1000)
  // }

  function generateQuizCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  // ...

  async function onSubmit(values: QuizFormValues) {
    setIsSubmitting(true);

    try {
      if (!user?._id) {
        toast({
          title: "Error",
          description: "You must be logged in as a teacher to create a quiz.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const createdBy = user._id;

      const payload = {
        ...values,
        createdBy,
        quizCode: generateQuizCode(),
      };

      console.log("🚀 ~ onSubmit ~ payload:", payload);

      const response = await axios.post(`${API_URL}/api/quiz/create`, payload, {
        withCredentials: true, // ✅ Send cookies like user_token!
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("🚀 ~ onSubmit ~ response:", response.data);

      toast({
        title: "Quiz Created",
        description: "Your quiz has been created successfully.",
      });

      router.push("/teacher/quizzes");
    } catch (error: any) {
      console.error("🚀 ~ onSubmit ~ error:", error);

      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Something went wrong while creating the quiz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
          <p className="text-muted-foreground">
            Create a new quiz for your students.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                <CardDescription>
                  Enter the basic information about your quiz.
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
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle>Question {index + 1}</CardTitle>
                      <CardDescription>
                        Create a multiple-choice question.
                      </CardDescription>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove question</span>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      {form
                        .getValues(`questions.${index}.options`)
                        .map((_, optionIndex) => (
                          <FormField
                            key={optionIndex}
                            control={form.control}
                            name={`questions.${index}.options.${optionIndex}`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}`}
                                      {...field}
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

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/teacher/quizzes")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Quiz
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </TeacherLayout>
  );
}
