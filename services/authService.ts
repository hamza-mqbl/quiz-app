import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth";

export const authService = {
  async signIn(email: string, password: string, role: "teacher" | "student") {
    const response = await axios.post(`${API_URL}/login-user`, { email, password, role }, { withCredentials: true });
    console.log("🚀 ~ signIn ~ response:", response)

    return response.data;
  },

  async signUp(name: string, email: string, password: string, role: "teacher" | "student") {
    const response = await axios.post(`${API_URL}/create-user`, { name, email, password, role }, { withCredentials: true });
    return response.data;
  },

  async signOut() {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  },

  async getCurrentUserFromServer() {
    const response = await axios.get(`${API_URL}/getuser`, { withCredentials: true });
    return response.data.user;
  }
};

