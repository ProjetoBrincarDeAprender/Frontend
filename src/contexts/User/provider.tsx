import useAuth from "@/hooks/Auth/useAuth";
import type { User } from "@/types/user";
import { type ReactNode, useEffect, useState } from "react";
import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const registerUser = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await profile();

      if (!response) {
        throw new Error("Failed to fetch user data");
      }

      setUser({
        id: response.id,
        nome_completo: response.nome_completo,
        email: response.email,
        perfil: response.perfil.nome,
        escola: response.escola?.nome || "",
      });
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};
