"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, Users, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast"; // Import the toast hook

// Types
interface Teacher {
  _id: string;
  name: string;
  email: string;
  totalQuizzesCreated: number;
  lastActivity: string | null;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherName: string;
}

// Delete Confirmation Modal
const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  teacherName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 text-white">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-semibold">Delete Teacher</h3>
        </div>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{teacherName}</span>? This action
          cannot be undone and will permanently remove their account and all
          quiz data.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    teacherId: "",
    teacherName: "",
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/admin/teachers"
        );
        const data = await response.json();
        if (data.success) {
          setTeachers(data.teachers);
        } else {
          console.error("Failed to fetch teachers");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (teacherId: string, teacherName: string) => {
    setDeleteModal({ isOpen: true, teacherId, teacherName });
  };

  const handleDeleteConfirm = async () => {
    try {
      // Send a DELETE request to the backend API to delete the teacher and their quizzes
      await axios.delete(
        `http://localhost:5000/api/admin/deleteTeacher/${deleteModal.teacherId}`
      );
      // Remove the teacher from the local state
      setTeachers((prev) =>
        prev.filter((teacher) => teacher._id !== deleteModal.teacherId)
      );

      // Close the modal
      setDeleteModal({ isOpen: false, teacherId: "", teacherName: "" });

      // Show success toast
      toast({
        title: "Teacher and quizzes deleted successfully!",
        description: `${deleteModal.teacherName} and their quizzes were removed.`,
      });
    } catch (error) {
      console.error("Error deleting teacher:", error);

      // Show error toast
      toast({
        title: "Sign up failed",
        description:
          "There was an error deleting the teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, teacherId: "", teacherName: "" });
  };

  const formatDate = (dateString: string | null) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "No activity yet";

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Teacher Management</h1>
          </div>
          <p className="text-gray-400">
            Manage your teachers and their quiz performance
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 dark:bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="mt-4 text-gray-400">Loading teachers...</p>
            </div>
          ) : (
            <>
              {filteredTeachers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm
                      ? "No teachers found matching your search."
                      : "No teachers found."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700 border-b border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Email
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Total Quizzes Created
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Last Activity
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher._id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 text-gray-300">
                            {teacher.name}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {teacher.email}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                              {teacher.totalQuizzesCreated}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                              {formatDate(teacher.lastActivity)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                handleDeleteClick(teacher._id, teacher.name)
                              }
                              className="inline-flex items-center p-2 text-red-400 hover:text-red-300 hover:bg-red-900 rounded-lg transition-colors"
                              title="Delete Teacher"
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

        {!loading && filteredTeachers.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="text-2xl font-bold text-gray-200">
                {filteredTeachers.length}
              </div>
              <div className="text-sm text-gray-400">Total Teachers</div>
            </div>
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="text-2xl font-bold text-gray-200">
                {Math.round(
                  filteredTeachers.reduce(
                    (sum, s) => sum + s.totalQuizzesCreated,
                    0
                  ) / filteredTeachers.length
                )}
              </div>
              <div className="text-sm text-gray-400">Avg Quizzes Created</div>
            </div>
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
              <div className="text-2xl font-bold text-gray-200">
                {filteredTeachers.reduce(
                  (sum, s) => sum + s.totalQuizzesCreated,
                  0
                )}
              </div>
              <div className="text-sm text-gray-400">Total Quizzes Created</div>
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          teacherName={deleteModal.teacherName}
        />
      </div>
    </div>
  );
}
