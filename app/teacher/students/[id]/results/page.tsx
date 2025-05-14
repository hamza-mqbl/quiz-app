"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileText,
  Search,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import TeacherLayout from "@/components/teacher-layout";
import axios from "axios";

// Mock student data
const mockStudentData = {
  id: "681f6a4a39f7a5d373b530e0",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  profileImage: null,
  performance: {
    quizzesTaken: 12,
    quizzesCompleted: 12,
    avgScore: 94,
    highestScore: 98,
    lowestScore: 85,
  },
};

// Mock quiz results data
const mockQuizResults = [
  {
    id: "1",
    quizName: "Advanced Biology: Cell Structure",
    subject: "Biology",
    score: 98,
    maxScore: 100,
    correctAnswers: 49,
    totalQuestions: 50,
    timeSpent: "45m",
    completedAt: "2023-05-10T14:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    quizName: "Chemistry: Periodic Table",
    subject: "Chemistry",
    score: 92,
    maxScore: 100,
    correctAnswers: 23,
    totalQuestions: 25,
    timeSpent: "38m",
    completedAt: "2023-05-08T10:15:00Z",
    status: "completed",
  },
  {
    id: "3",
    quizName: "Physics: Mechanics",
    subject: "Physics",
    score: 90,
    maxScore: 100,
    correctAnswers: 18,
    totalQuestions: 20,
    timeSpent: "52m",
    completedAt: "2023-05-05T16:20:00Z",
    status: "completed",
  },
  {
    id: "4",
    quizName: "Mathematics: Calculus",
    subject: "Mathematics",
    score: 95,
    maxScore: 100,
    correctAnswers: 19,
    totalQuestions: 20,
    timeSpent: "40m",
    completedAt: "2023-05-01T09:45:00Z",
    status: "completed",
  },
  {
    id: "5",
    quizName: "Biology: Genetics",
    subject: "Biology",
    score: 85,
    maxScore: 100,
    correctAnswers: 17,
    totalQuestions: 20,
    timeSpent: "35m",
    completedAt: "2023-04-28T11:20:00Z",
    status: "completed",
  },
  {
    id: "6",
    quizName: "Chemistry: Chemical Bonds",
    subject: "Chemistry",
    score: 88,
    maxScore: 100,
    correctAnswers: 22,
    totalQuestions: 25,
    timeSpent: "42m",
    completedAt: "2023-04-25T13:45:00Z",
    status: "completed",
  },
  {
    id: "7",
    quizName: "Physics: Thermodynamics",
    subject: "Physics",
    score: 92,
    maxScore: 100,
    correctAnswers: 23,
    totalQuestions: 25,
    timeSpent: "48m",
    completedAt: "2023-04-20T15:30:00Z",
    status: "completed",
  },
  {
    id: "8",
    quizName: "Mathematics: Algebra",
    subject: "Mathematics",
    score: 96,
    maxScore: 100,
    correctAnswers: 24,
    totalQuestions: 25,
    timeSpent: "37m",
    completedAt: "2023-04-18T10:15:00Z",
    status: "completed",
  },
  {
    id: "9",
    quizName: "Biology: Ecosystems",
    subject: "Biology",
    score: 94,
    maxScore: 100,
    correctAnswers: 47,
    totalQuestions: 50,
    timeSpent: "55m",
    completedAt: "2023-04-15T14:20:00Z",
    status: "completed",
  },
  {
    id: "10",
    quizName: "Chemistry: Acids and Bases",
    subject: "Chemistry",
    score: 90,
    maxScore: 100,
    correctAnswers: 18,
    totalQuestions: 20,
    timeSpent: "32m",
    completedAt: "2023-04-10T09:30:00Z",
    status: "completed",
  },
  {
    id: "11",
    quizName: "Physics: Electricity",
    subject: "Physics",
    score: 88,
    maxScore: 100,
    correctAnswers: 22,
    totalQuestions: 25,
    timeSpent: "45m",
    completedAt: "2023-04-05T11:15:00Z",
    status: "completed",
  },
  {
    id: "12",
    quizName: "Mathematics: Geometry",
    subject: "Mathematics",
    score: 92,
    maxScore: 100,
    correctAnswers: 23,
    totalQuestions: 25,
    timeSpent: "40m",
    completedAt: "2023-04-01T10:45:00Z",
    status: "completed",
  },
];

// Mock quiz details for the dialog
const mockQuizDetails = {
  id: "1",
  quizName: "Advanced Biology: Cell Structure",
  subject: "Biology",
  description: "A comprehensive quiz on cell structure and function.",
  score: 98,
  maxScore: 100,
  correctAnswers: 49,
  totalQuestions: 50,
  timeSpent: "45m",
  completedAt: "2023-05-10T14:30:00Z",
  status: "completed",
  questions: [
    {
      id: "q1",
      questionText: "What is the powerhouse of the cell?",
      correctAnswer: "Mitochondria",
      studentAnswer: "Mitochondria",
      isCorrect: true,
    },
    {
      id: "q2",
      questionText: "Which organelle is responsible for protein synthesis?",
      correctAnswer: "Ribosome",
      studentAnswer: "Ribosome",
      isCorrect: true,
    },
    {
      id: "q3",
      questionText: "What is the function of the cell membrane?",
      correctAnswer: "To control what enters and exits the cell",
      studentAnswer: "To control what enters and exits the cell",
      isCorrect: true,
    },
    {
      id: "q4",
      questionText:
        "Which of the following is NOT a part of the endomembrane system?",
      correctAnswer: "Mitochondria",
      studentAnswer: "Mitochondria",
      isCorrect: true,
    },
    {
      id: "q5",
      questionText: "What is the main function of lysosomes?",
      correctAnswer: "Digestion of cellular waste",
      studentAnswer: "Digestion of cellular waste",
      isCorrect: true,
    },
  ],
};

export default function StudentResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: studentId } = useParams();

  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "completedAt",
    direction: "descending",
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [quizDetailsOpen, setQuizDetailsOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the student data and quiz results from your API
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     // Simulate API call
    //     await new Promise((resolve) => setTimeout(resolve, 1000));

    //     // Use mock data for demo
    //     setStudent(mockStudentData);
    //     setQuizResults(mockQuizResults);
    //     setError(null);
    //   } catch (error) {
    //     console.error("Failed to fetch data:", error);
    //     setError("Failed to load student results. Please try again.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchRealData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/students/result-overview/${studentId}`,
          { withCredentials: true }
        );
        setStudent(res.data.student);
        setQuizResults(res.data.quizResults);

        // Use mock data for demo
        // setStudent(mockStudentData);
        // setQuizResults(mockQuizResults);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load student results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // fetchData();
    fetchRealData();
  }, [studentId]);

  // Filter quiz results based on search term and subject filter
  const filteredResults = quizResults.filter((result) => {
    const matchesSearch = result.quizName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || result.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  // Sort quiz results based on sort config
  const sortedResults = [...filteredResults].sort((a, b) => {
    const key = sortConfig.key as keyof typeof a;

    if (key === "completedAt") {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return sortConfig.direction === "ascending"
        ? dateA - dateB
        : dateB - dateA;
    }

    if (a[key] < b[key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Get sort direction icon
  const getSortDirectionIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Get unique subjects for filter
  const subjects = [
    "all",
    ...Array.from(new Set(quizResults.map((result) => result.subject))),
  ];

  // Handle export
  const handleExport = async (format: string) => {
    setExportFormat(format);
    setExportLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Export Complete",
      description: `Results have been exported as ${format.toUpperCase()}.`,
    });

    setExportLoading(false);
    setExportFormat(null);
  };

  // Handle view quiz details
  // const handleViewQuizDetails = (quizId: string) => {
  //   // In a real app, you would fetch the quiz details from your API
  //   setSelectedQuiz(mockQuizDetails);
  //   setQuizDetailsOpen(true);
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full md:w-64" />
            <Skeleton className="h-10 w-full md:w-40" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TeacherLayout>
    );
  }

  if (error || !student) {
    return (
      <TeacherLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex flex-col items-center text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Failed to Load Results</h2>
            <p className="text-muted-foreground mb-6">
              {error || "Student not found"}
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/teacher/students")}
              >
                Back to Students
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
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border">
              <AvatarImage
                src={
                  student.profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
                }
                alt={student.name}
              />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {student.name}'s Results
              </h1>
              <p className="text-muted-foreground">{student.email}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => router.push(`/teacher/students/${studentId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Student
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {student.performance.avgScore}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across all quizzes
              </p>
              <div className="mt-4 h-2">
                <Progress
                  value={student.performance.avgScore}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Quizzes Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {student.performance.quizzesTaken}
              </div>
              <p className="text-xs text-muted-foreground">
                {student.performance.quizzesCompleted} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Highest Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {student.performance.highestScore}%
              </div>
              <p className="text-xs text-muted-foreground">Best performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Lowest Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {student.performance.lowestScore}%
              </div>
              <p className="text-xs text-muted-foreground">Needs improvement</p>
            </CardContent>
          </Card>
        </div>

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
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject === "all" ? "All Subjects" : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              Showing {sortedResults.length} of {quizResults.length} results
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">#</TableHead>
                  <TableHead className="w-[300px]">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => requestSort("quizName")}
                    >
                      Quiz Name {getSortDirectionIcon("quizName")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => requestSort("subject")}
                    >
                      Subject {getSortDirectionIcon("subject")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => requestSort("score")}
                    >
                      Score {getSortDirectionIcon("score")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => requestSort("completedAt")}
                    >
                      Date {getSortDirectionIcon("completedAt")}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.length > 0 ? (
                  sortedResults.map((result, index) => (
                    <TableRow key={result.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {result.quizName}
                      </TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              result.score >= 90
                                ? "text-green-600 dark:text-green-400"
                                : result.score >= 75
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {result.score}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({result.correctAnswers}/{result.totalQuestions})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(result.completedAt)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{sortedResults.length}</strong> of{" "}
              <strong>{quizResults.length}</strong> results
            </div>
            <div className="text-sm text-muted-foreground">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <span className="mx-2">
                Page <strong>1</strong> of <strong>1</strong>
              </span>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={quizDetailsOpen} onOpenChange={setQuizDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.quizName}</DialogTitle>
            <DialogDescription>
              Completed on{" "}
              {selectedQuiz && formatDateTime(selectedQuiz.completedAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedQuiz && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {selectedQuiz.score}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Correct Answers
                  </div>
                  <div className="text-xl font-bold">
                    {selectedQuiz.correctAnswers}/{selectedQuiz.totalQuestions}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Time Spent
                  </div>
                  <div className="text-xl font-bold">
                    {selectedQuiz.timeSpent}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Subject</div>
                  <div className="text-xl font-bold">
                    {selectedQuiz.subject}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Questions</h3>
                {selectedQuiz.questions.map((question: any, index: number) => (
                  <div
                    key={question.id}
                    className="space-y-2 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="font-medium">{question.questionText}</div>
                    </div>
                    <div className="ml-8 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Correct Answer:
                        </span>
                        <span>{question.correctAnswer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Student Answer:
                        </span>
                        <span
                          className={
                            question.isCorrect
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {question.studentAnswer}
                        </span>
                        {question.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuizDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
}
