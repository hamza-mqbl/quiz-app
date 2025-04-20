export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}
