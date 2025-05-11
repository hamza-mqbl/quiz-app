"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  MoreHorizontal,
  UserPlus,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import TeacherLayout from "@/components/teacher-layout";

// Mock data for students
const mockStudents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    joinedDate: "2023-01-15",
    quizzesTaken: 12,
    avgScore: 94,
    lastActive: "2023-05-10",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    joinedDate: "2023-02-03",
    quizzesTaken: 10,
    avgScore: 92,
    lastActive: "2023-05-11",
    status: "active",
  },
  {
    id: "3",
    name: "Ashley Williams",
    email: "ashley.williams@example.com",
    joinedDate: "2023-01-20",
    quizzesTaken: 11,
    avgScore: 89,
    lastActive: "2023-05-09",
    status: "active",
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.rodriguez@example.com",
    joinedDate: "2023-03-05",
    quizzesTaken: 8,
    avgScore: 78,
    lastActive: "2023-05-01",
    status: "inactive",
  },
  {
    id: "5",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    joinedDate: "2023-02-15",
    quizzesTaken: 9,
    avgScore: 85,
    lastActive: "2023-05-08",
    status: "active",
  },
  {
    id: "6",
    name: "David Wilson",
    email: "david.wilson@example.com",
    joinedDate: "2023-03-10",
    quizzesTaken: 7,
    avgScore: 82,
    lastActive: "2023-05-05",
    status: "active",
  },
  {
    id: "7",
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    joinedDate: "2023-01-25",
    quizzesTaken: 12,
    avgScore: 91,
    lastActive: "2023-05-10",
    status: "active",
  },
  {
    id: "8",
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    joinedDate: "2023-02-20",
    quizzesTaken: 6,
    avgScore: 75,
    lastActive: "2023-04-28",
    status: "inactive",
  },
  {
    id: "9",
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    joinedDate: "2023-03-15",
    quizzesTaken: 8,
    avgScore: 88,
    lastActive: "2023-05-09",
    status: "active",
  },
  {
    id: "10",
    name: "Noah Taylor",
    email: "noah.taylor@example.com",
    joinedDate: "2023-04-01",
    quizzesTaken: 5,
    avgScore: 79,
    lastActive: "2023-05-07",
    status: "active",
  },
];

// Mock data for student performance
const mockPerformanceData = [
  { subject: "Biology", avgScore: 85, quizzesTaken: 3, highestScore: 95 },
  { subject: "Chemistry", avgScore: 78, quizzesTaken: 2, highestScore: 88 },
  { subject: "Physics", avgScore: 92, quizzesTaken: 2, highestScore: 98 },
  { subject: "Mathematics", avgScore: 80, quizzesTaken: 3, highestScore: 90 },
  { subject: "History", avgScore: 88, quizzesTaken: 2, highestScore: 94 },
];

// Mock data for recent activities
const mockRecentActivities = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    action: "Completed quiz",
    quizName: "Biology Basics",
    score: 95,
    date: "2023-05-10",
  },
  {
    id: "2",
    studentName: "Michael Chen",
    action: "Completed quiz",
    quizName: "Chemistry Fundamentals",
    score: 92,
    date: "2023-05-11",
  },
  {
    id: "3",
    studentName: "Ashley Williams",
    action: "Started quiz",
    quizName: "Physics Mechanics",
    score: null,
    date: "2023-05-09",
  },
  {
    id: "4",
    studentName: "Emma Thompson",
    action: "Completed quiz",
    quizName: "World History",
    score: 85,
    date: "2023-05-08",
  },
  {
    id: "5",
    studentName: "David Wilson",
    action: "Abandoned quiz",
    quizName: "Advanced Mathematics",
    score: null,
    date: "2023-05-05",
  },
];

export default function StudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Filter students based on search term and status filter
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort students based on sort config
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key as keyof typeof a;

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

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Get sort direction icon
  const getSortDirectionIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Handle sending message to student
  const handleSendMessage = (studentId: string, studentName: string) => {
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${studentName}.`,
    });
  };

  // Handle exporting student data
  const handleExportData = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Export Complete",
        description: "Student data has been exported successfully.",
      });
    }, 1500);
  };

  // Handle adding a new student
  const handleAddStudent = () => {
    router.push("/teacher/students/add");
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage your students and track their progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>
            <Button onClick={handleAddStudent}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all-students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-students">All Students</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="all-students" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <button
                          className="flex items-center gap-1 hover:text-primary"
                          onClick={() => requestSort("name")}
                        >
                          Student {getSortDirectionIcon("name")}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-primary"
                          onClick={() => requestSort("quizzesTaken")}
                        >
                          Quizzes Taken {getSortDirectionIcon("quizzesTaken")}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-primary"
                          onClick={() => requestSort("avgScore")}
                        >
                          Avg. Score {getSortDirectionIcon("avgScore")}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-primary"
                          onClick={() => requestSort("lastActive")}
                        >
                          Last Active {getSortDirectionIcon("lastActive")}
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStudents.length > 0 ? (
                      sortedStudents.map((student) => (
                        <TableRow key={student.id} className="group">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                  alt={student.name}
                                />
                                <AvatarFallback>
                                  {student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {student.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.quizzesTaken}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-medium ${
                                  student.avgScore >= 90
                                    ? "text-green-600 dark:text-green-400"
                                    : student.avgScore >= 75
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {student.avgScore}%
                              </span>
                              {student.avgScore >= 90 && (
                                <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(student.lastActive).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {student.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/teacher/students/${student.id}`
                                    )
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSendMessage(student.id, student.name)
                                  }
                                >
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/teacher/students/${student.id}/results`
                                    )
                                  }
                                >
                                  View Results
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/teacher/students/${student.id}/edit`
                                    )
                                  }
                                >
                                  Edit Student
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{sortedStudents.length}</strong> of{" "}
                  <strong>{mockStudents.length}</strong> students
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
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      mockStudents.reduce(
                        (acc, student) => acc + student.avgScore,
                        0
                      ) / mockStudents.length
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all students
                  </p>
                  <div className="mt-4 h-2">
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Quizzes Taken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockStudents.reduce(
                      (acc, student) => acc + student.quizzesTaken,
                      0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all students
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      mockStudents.filter(
                        (student) => student.status === "active"
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of {mockStudents.length} total students
                  </p>
                  <div className="mt-4 h-2">
                    <Progress
                      value={
                        (mockStudents.filter(
                          (student) => student.status === "active"
                        ).length /
                          mockStudents.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>
                  Average scores by subject across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformanceData.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{subject.subject}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">
                              {subject.quizzesTaken}
                            </span>{" "}
                            quizzes
                          </div>
                          <div className="text-sm">
                            <span
                              className={`font-medium ${
                                subject.avgScore >= 90
                                  ? "text-green-600 dark:text-green-400"
                                  : subject.avgScore >= 75
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {subject.avgScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Progress value={subject.avgScore} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Highest: {subject.highestScore}%</span>
                        <span>Average: {subject.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Students</CardTitle>
                <CardDescription>
                  Students with the highest average scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents
                    .sort((a, b) => b.avgScore - a.avgScore)
                    .slice(0, 5)
                    .map((student, index) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.quizzesTaken} quizzes taken
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              student.avgScore >= 90
                                ? "text-green-600 dark:text-green-400"
                                : student.avgScore >= 75
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {student.avgScore}%
                          </span>
                          {index === 0 && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Student Activity</CardTitle>
                <CardDescription>
                  Latest quiz attempts and completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockRecentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.studentName}`}
                          alt={activity.studentName}
                        />
                        <AvatarFallback>
                          {activity.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="font-medium">
                              {activity.studentName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.action}{" "}
                              <span className="font-medium">
                                {activity.quizName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.score !== null ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              >
                                Score: {activity.score}%
                              </Badge>
                            ) : activity.action === "Started quiz" ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              >
                                In Progress
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                              >
                                Abandoned
                              </Badge>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>
                  Overview of student activity in the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground text-center">
                      Quizzes Completed
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-muted-foreground text-center">
                      Quizzes In Progress
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                      <XCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground text-center">
                      Quizzes Abandoned
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  );
}
