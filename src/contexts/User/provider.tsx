import useAuth from "@/hooks/Auth/useAuth";
import type { User } from "@/types/user";
import Cookies from "js-cookie";
import { type ReactNode, useEffect, useState } from "react";
import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();
  const { data: profileData, isLoading } = profile;
  const [user, setUser] = useState<User | null>(profileData || null);

  const registerUser = (userData: User | null) => {
    setUser(userData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setUser(profileData || null);
    };

    if (Cookies.get("authToken")) {
      fetchUser();
    }
  }, [profileData]);

  if (isLoading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};
