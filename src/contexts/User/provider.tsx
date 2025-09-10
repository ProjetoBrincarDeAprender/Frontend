import useAuth from "@/hooks/Auth/useAuth";
import type { User } from "@/types/user";
import Cookies from "js-cookie";
import { type ReactNode, useEffect, useState } from "react";
import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const registerUser = (userData: User | null) => {
    setUser(userData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await profile();

      if (!response) {
        throw new Error("Failed to fetch user data");
      }

      setUser({
        codigo_usuario: response.codigo_usuario,
        nome_completo: response.nome_completo,
        email: response.email,
        perfil: response.perfil,
        escola: {
          id: response.escolaId,
          nome: response.escola?.nome,
        },
      });
    };

    if (Cookies.get("authToken")) {
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};
