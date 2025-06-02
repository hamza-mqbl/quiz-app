"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, Users, AlertTriangle } from "lucide-react";

// Types
interface Student {
  _id: string;
  name: string;
  email: string;
  quizzesTaken: number;
  averageScore: number;
  lastActivity: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
}

// Delete Confirmation Modal
const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 text-white">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-semibold">Delete Student</h3>
        </div>
        <p className="text-gray-300 dark:text-gray-200 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{studentName}</span>? This action
          cannot be undone and will permanently remove their account and all
          quiz data.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 dark:text-gray-500 hover:text-gray-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    studentId: "",
    studentName: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/admin/users");
        const data = await response.json();
        if (data.success) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (studentId: string, studentName: string) => {
    setDeleteModal({ isOpen: true, studentId, studentName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/deleteUser/${deleteModal.studentId}`,
        {
          method: "DELETE",
        }
      );
      setStudents((prev) =>
        prev.filter((student) => student.id !== deleteModal.studentId)
      );
      setDeleteModal({ isOpen: false, studentId: "", studentName: "" });
      console.log("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, studentId: "", studentName: "" });
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Student Management</h1>
          </div>
          <p className="text-gray-400 dark:text-gray-300">
            Manage your students who attempt Quizzes
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-700 overflow-hidden dark:bg-gray-800">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="mt-4 text-gray-400 dark:text-gray-300">
                Loading students...
              </p>
            </div>
          ) : (
            <>
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 dark:text-gray-300">
                    {searchTerm
                      ? "No students found matching your search."
                      : "No students found."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700 dark:bg-gray-800 border-b border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Email
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Quizzes Taken
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Average Score
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Last Activity
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <td className="px-6 py-4">{student.name}</td>
                          <td className="px-6 py-4 text-gray-300 dark:text-gray-200">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                              {student.quizzesTaken}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                student.averageScore >= 80
                                  ? "bg-green-900 text-green-200"
                                  : student.averageScore >= 60
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-red-900 text-red-200"
                              }`}
                            >
                              {student.averageScore.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {formatDate(student.lastActivity)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                handleDeleteClick(student.id, student.name)
                              }
                              className="inline-flex items-center p-2 text-red-400 hover:text-red-300 hover:bg-red-900 rounded-lg transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && filteredStudents.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="text-2xl font-bold">
                {filteredStudents.length}
              </div>
              <div className="text-sm text-gray-400">Total Students</div>
            </div>
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) /
                    filteredStudents.length
                )}
                %
              </div>
              <div className="text-sm text-gray-400">Class Average</div>
            </div>
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="text-2xl font-bold">
                {filteredStudents.reduce((sum, s) => sum + s.quizzesTaken, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Quiz Attempts</div>
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          studentName={deleteModal.studentName}
        />
      </div>
    </div>
  );
}
