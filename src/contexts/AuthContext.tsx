
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, LoginCredentials, SignupCredentials, AuthUser, InviteData } from "@/types/auth";
import { mockAuthUsers, generateTeamCode } from "@/data/authMockData";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  inviteTeamMember: (inviteData: InviteData) => Promise<string>;
  joinWithTeamCode: (teamCode: string, userDetails: Omit<SignupCredentials, 'teamCode'>) => Promise<boolean>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for saved user in local storage (simulating persistent login)
    const savedUser = localStorage.getItem("taskopia_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as AuthUser;
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem("taskopia_user");
        setState({ ...initialState, isLoading: false });
      }
    } else {
      setState({ ...initialState, isLoading: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState({ ...state, isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockAuthUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      localStorage.setItem("taskopia_user", JSON.stringify(user));
      toast.success("Login successful!");
      return true;
    } else {
      setState({
        ...state,
        isLoading: false,
        error: "Invalid email or password",
      });
      toast.error("Invalid email or password");
      return false;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setState({ ...state, isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    if (mockAuthUsers.some((u) => u.email === credentials.email)) {
      setState({
        ...state,
        isLoading: false,
        error: "Email already exists",
      });
      toast.error("Email already exists");
      return false;
    }

    // Create new user
    const newUser: AuthUser = {
      id: `user-${mockAuthUsers.length + 1}`,
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
      avatar: `https://ui-avatars.com/api/?name=${credentials.name.replace(' ', '+')}&background=8B3D8B&color=fff`,
      isAdmin: true, // First user of team is admin
      teamCode: generateTeamCode(),
    };

    // Add to mock data (in a real app this would persist to a database)
    mockAuthUsers.push(newUser);

    // Set as current user
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    
    localStorage.setItem("taskopia_user", JSON.stringify(newUser));
    toast.success("Account created successfully!");
    return true;
  };

  const logout = () => {
    localStorage.removeItem("taskopia_user");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    toast.info("Logged out successfully");
  };

  const inviteTeamMember = async (inviteData: InviteData): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would send an email with the invite link
    // For mock purposes, we'll just return the team code
    toast.success(`Team invitation sent to ${inviteData.email}`);
    return inviteData.teamCode;
  };

  const joinWithTeamCode = async (
    teamCode: string, 
    userDetails: Omit<SignupCredentials, 'teamCode'>
  ): Promise<boolean> => {
    setState({ ...state, isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if the team code exists
    const teamExists = mockAuthUsers.some(user => user.teamCode === teamCode);
    
    if (!teamExists) {
      setState({
        ...state,
        isLoading: false,
        error: "Invalid team code",
      });
      toast.error("Invalid team code");
      return false;
    }

    // Check if email already exists
    if (mockAuthUsers.some((u) => u.email === userDetails.email)) {
      setState({
        ...state,
        isLoading: false,
        error: "Email already exists",
      });
      toast.error("Email already exists");
      return false;
    }

    // Create new team member
    const newUser: AuthUser = {
      id: `user-${mockAuthUsers.length + 1}`,
      name: userDetails.name,
      email: userDetails.email,
      password: userDetails.password,
      role: userDetails.role,
      avatar: `https://ui-avatars.com/api/?name=${userDetails.name.replace(' ', '+')}&background=3D5D8B&color=fff`,
      isAdmin: false, // Joined users are not admins by default
      teamCode: teamCode,
    };

    // Add to mock data
    mockAuthUsers.push(newUser);

    // Set as current user
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    
    localStorage.setItem("taskopia_user", JSON.stringify(newUser));
    toast.success("Joined team successfully!");
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        inviteTeamMember,
        joinWithTeamCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
