import type { User } from "@/types/user";
import { createContext } from "react";

export type UserContextType = {
  user: User | null;
  registerUser: (userData: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
