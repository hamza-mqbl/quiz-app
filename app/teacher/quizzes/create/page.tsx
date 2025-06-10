"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Plus, Save, MapPin } from "lucide-react";

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
import axios from "axios";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import TeacherLayout from "@/components/teacher-layout";
import { AuthContext } from "@/components/auth-provider";
import { LocationPicker } from "@/components/location-picker";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  topic: z.string().min(2, { message: "Topic must be at least 2 characters." }),
  description: z.string().optional(),
  timeLimit: z
    .number()
    .min(1, { message: "Time limit must be at least 1 minute" })
    .max(300, { message: "Time limit cannot exceed 300 minutes (5 hours)" }),
  enableLocationRestriction: z.boolean().default(false),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      radius: z
        .number()
        .min(10, { message: "Radius must be at least 10 meters" }),
      address: z.string(),
    })
    .optional(),
  questions: z
    .array(
      z.object({
        questionText: z
          .string()
          .min(2, { message: "Question must be at least 2 characters." }),
        options: z
          .array(z.string().min(1, { message: "Option cannot be empty." }))
          .min(2, { message: "At least 2 options are required." }),
        correctAnswer: z
          .string()
          .min(1, { message: "Please select a correct answer." }),
      })
    )
    .min(1, { message: "At least one question is required." }),
});

type QuizFormValues = z.infer<typeof formSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [generationMode, setGenerationMode] = useState<"manual" | "ai">(
    "manual"
  );
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      topic: "",
      description: "",
      timeLimit: 30, // Default 30 minutes
      enableLocationRestriction: false,
      location: {
        latitude: 0,
        longitude: 0,
        radius: 100,
        address: "",
      },
      questions: [
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const enableLocationRestriction = form.watch("enableLocationRestriction");

  function generateQuizCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  const handleLocationSet = (locationData: {
    latitude: number;
    longitude: number;
    radius: number;
    address: string;
  }) => {
    form.setValue("location", locationData);
  };

  async function onSubmit(values: QuizFormValues) {
    setIsSubmitting(true);
    if (!user?._id) {
      toast({
        title: "Error",
        description: "You must be logged in.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate location if restriction is enabled
    if (values.enableLocationRestriction) {
      if (
        !values.location ||
        values.location.latitude === 0 ||
        values.location.longitude === 0
      ) {
        toast({
          title: "Location Required",
          description: "Please set a location for this quiz.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      ...values,
      createdBy: user._id,
      quizCode: generateQuizCode(),
      // Only include location if restriction is enabled
      location: values.enableLocationRestriction ? values.location : undefined,
    };

    try {
      const response = await axios.post(`${API_URL}/api/quiz/create`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "Quiz Created",
        description: values.enableLocationRestriction
          ? "Quiz saved with location restrictions."
          : "Quiz saved successfully.",
      });

      router.push("/teacher/quizzes");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save quiz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create Quiz</h1>

        <div className="flex gap-4">
          <Button
            variant={generationMode === "manual" ? "default" : "outline"}
            onClick={() => setGenerationMode("manual")}
          >
            Manual
          </Button>
          <Button
            variant={generationMode === "ai" ? "default" : "outline"}
            onClick={() => setGenerationMode("ai")}
          >
            Generate with AI
          </Button>
        </div>

        {generationMode === "ai" && (
          <Card>
            <CardHeader>
              <CardTitle>Auto Generate Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Topic (e.g. World War II)"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
              <select
                className="border p-2 rounded w-full"
                value={aiCount}
                onChange={(e) => setAiCount(Number(e.target.value))}
              >
                {[20, 30, 40, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} Questions
                  </option>
                ))}
              </select>
              <Button
                disabled={isGenerating}
                onClick={async () => {
                  setIsGenerating(true);
                  try {
                    const res = await axios.post(
                      `${API_URL}/api/quiz/generate`,
                      {
                        topic: aiTopic,
                        numberOfQuestions: aiCount,
                      }
                    );
                    form.setValue("title", `${aiTopic} Quiz`);
                    form.setValue("topic", aiTopic);
                    form.setValue("questions", res.data.questions);
                    toast({ title: "Success", description: "Quiz generated." });
                  } catch {
                    toast({
                      title: "Error",
                      description: "Could not generate quiz.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsGenerating(false);
                  }
                }}
              >
                {isGenerating ? "Generating..." : "Generate Quiz"}
              </Button>
            </CardContent>
          </Card>
        )}

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
                          placeholder="e.g. Introduction to Biology"
                          {...field}
                        />
                      </FormControl>
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
                        <Input placeholder="Science, Math, etc." {...field} />
                      </FormControl>
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
                          placeholder="Brief description..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (Minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 30"
                          min="1"
                          max="300"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Set the quiz duration in minutes (1-300 minutes)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Settings
                </CardTitle>
                <CardDescription>
                  Optionally restrict quiz access to specific locations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="enableLocationRestriction"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Location Restriction
                        </FormLabel>
                        <FormDescription>
                          Students must be within a specific location to take
                          this quiz.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {enableLocationRestriction && (
                  <LocationPicker
                    onLocationSet={handleLocationSet}
                    initialLocation={form.getValues("location")}
                  />
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Questions</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      questionText: "",
                      options: ["", "", "", ""],
                      correctAnswer: "",
                    })
                  }
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
                                <FormControl>
                                  <Input
                                    placeholder={`Option ${optionIndex + 1}`}
                                    {...field}
                                  />
                                </FormControl>
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
                                .map((option, optionIndex) =>
                                  option ? (
                                    <FormItem
                                      key={optionIndex}
                                      className="flex items-center space-x-3"
                                    >
                                      <FormControl>
                                        <RadioGroupItem value={option} />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option}
                                      </FormLabel>
                                    </FormItem>
                                  ) : null
                                )}
                            </RadioGroup>
                          </FormControl>
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
                  "Saving..."
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
