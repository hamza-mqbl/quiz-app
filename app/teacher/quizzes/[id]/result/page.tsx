"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  Users,
  Trophy,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TeacherLayout from "@/components/teacher-layout";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

interface StudentResult {
  id: string;
  studentName: string;
  email: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent: string;
  submittedAt: string;
  status: "passed" | "failed";
}

interface QuizData {
  id: string;
  title: string;
  topic: string;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  createdAt: string;
}

export default function QuizResultPage() {
  const params = useParams();
  const quizId = params.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);

  useEffect(() => {
    fetchQuizResults();
  }, [quizId]);

  const fetchQuizResults = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/result`,
        { withCredentials: true }
      );

      const { quiz, results } = response.data;

      setQuizData(quiz); // not quizData
      setStudentResults(results);
    } catch (error) {
      console.error("Failed to fetch quiz results:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz results.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  //   const fetchQuizResults = async () => {
  //     try {
  //       setLoading(true);

  //       // Static data for now - replace with actual API call
  //       const mockQuizData: QuizData = {
  //         id: quizId,
  //         title: "JavaScript Fundamentals",
  //         topic: "Programming",
  //         totalQuestions: 10,
  //         totalMarks: 100,
  //         passingMarks: 60,
  //         createdAt: "2024-01-15",
  //       };

  //       const mockResults: StudentResult[] = [
  //         {
  //           id: "1",
  //           studentName: "John Doe",
  //           email: "john.doe@student.edu",
  //           score: 85,
  //           totalMarks: 100,
  //           percentage: 85,
  //           timeSpent: "25 min",
  //           submittedAt: "2024-01-16T10:30:00Z",
  //           status: "passed",
  //         },
  //         {
  //           id: "2",
  //           studentName: "Jane Smith",
  //           email: "jane.smith@student.edu",
  //           score: 92,
  //           totalMarks: 100,
  //           percentage: 92,
  //           timeSpent: "22 min",
  //           submittedAt: "2024-01-16T11:15:00Z",
  //           status: "passed",
  //         },
  //         {
  //           id: "3",
  //           studentName: "Mike Johnson",
  //           email: "mike.johnson@student.edu",
  //           score: 45,
  //           totalMarks: 100,
  //           percentage: 45,
  //           timeSpent: "30 min",
  //           submittedAt: "2024-01-16T14:20:00Z",
  //           status: "failed",
  //         },
  //         {
  //           id: "4",
  //           studentName: "Sarah Wilson",
  //           email: "sarah.wilson@student.edu",
  //           score: 78,
  //           totalMarks: 100,
  //           percentage: 78,
  //           timeSpent: "28 min",
  //           submittedAt: "2024-01-16T15:45:00Z",
  //           status: "passed",
  //         },
  //         {
  //           id: "5",
  //           studentName: "David Brown",
  //           email: "david.brown@student.edu",
  //           score: 67,
  //           totalMarks: 100,
  //           percentage: 67,
  //           timeSpent: "26 min",
  //           submittedAt: "2024-01-16T16:30:00Z",
  //           status: "passed",
  //         },
  //       ];

  //       setQuizData(mockQuizData);
  //       setStudentResults(mockResults);
  //     } catch (error) {
  //       console.error("Failed to fetch quiz results:", error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to load quiz results.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const filteredResults = studentResults.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting results to ${format.toUpperCase()}...`,
    });
    // Add export logic here
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quiz results...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  if (!quizData) {
    return (
      <TeacherLayout>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Quiz not found.</p>
        </div>
      </TeacherLayout>
    );
  }

  const passedStudents = studentResults.filter(
    (r) => r.status === "passed"
  ).length;
  const averageScore = Math.round(
    studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length
  );
  const averagePercentage = studentResults.length
    ? studentResults.reduce((sum, s) => sum + s.percentage, 0) /
      studentResults.length
    : 0;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher/quizzes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quizzes
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {quizData.title} - Results
            </h1>
            <p className="text-muted-foreground">
              View and manage quiz results for all students
            </p>
          </div>
        </div>

        {/* Quiz Info Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentResults.length}</div>
              <p className="text-xs text-muted-foreground">
                Attempted this quiz
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((passedStudents / studentResults.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {passedStudents} out of {studentResults.length} passed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averagePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                Out of {quizData.totalMarks} marks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Info</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizData.totalQuestions}
              </div>
              <p className="text-xs text-muted-foreground">
                Questions • {quizData.topic}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.studentName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {result.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">
                          {result.score}/{result.totalMarks}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-medium ${
                            result.percentage >= 80
                              ? "text-green-600 dark:text-green-400"
                              : result.percentage >= 60
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {result.percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            result.status === "passed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {result.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(result.submittedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No students found matching your search."
                    : "No students have attempted this quiz yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
