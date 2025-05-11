import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async signIn(email: string, password: string, role: "teacher" | "student") {
    const response = await axios.post(
      `${API_URL}/api/auth/login-user`,
      { email, password, role },
      { withCredentials: true }
    );
    return response?.data;
  },

  async signUp(
    name: string,
    email: string,
    password: string,
    role: "teacher" | "student"
  ) {
    const response = await axios.post(
      `${API_URL}/api/auth/create-user`,
      { name, email, password, role },
      { withCredentials: true }
    );
    return response.data;
  },

  async signOut() {
    await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  },

  async getCurrentUserFromServer() {
    const response = await axios.get(`${API_URL}/api/auth/getuser`, {
      withCredentials: true,
    });
    return response.data.user;
  },
};
