
import { User } from "./kanban";

export type AuthUser = User & {
  email: string;
  password: string;
  isAdmin: boolean;
  teamCode?: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type InviteData = {
  email: string;
  role: string;
  teamCode: string;
};
