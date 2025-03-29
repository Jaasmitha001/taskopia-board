
import { AuthUser } from "@/types/auth";
import { users } from "./mockData";

// Create mock auth users based on our existing users
export const mockAuthUsers: AuthUser[] = [
  {
    ...users[0],
    email: "john.doe@example.com",
    password: "password123",
    isAdmin: true,
    teamCode: "TEAM123",
  },
  {
    ...users[1],
    email: "alice.smith@example.com",
    password: "password123",
    isAdmin: false,
    teamCode: "TEAM123",
  },
  {
    ...users[2],
    email: "emma.johnson@example.com",
    password: "password123",
    isAdmin: false,
    teamCode: "TEAM123",
  },
  {
    ...users[3],
    email: "michael.brown@example.com",
    password: "password123",
    isAdmin: false,
    teamCode: "TEAM123",
  },
  {
    ...users[4],
    email: "sophia.martinez@example.com",
    password: "password123", 
    isAdmin: false,
    teamCode: "TEAM123",
  },
];

// Generate a random team code
export const generateTeamCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
