import type { User, UserProfile } from "@/types/user";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useCallback } from "react";
import { toast } from "sonner";

export const USER_PROFILE_QUERY_KEY = ["user-profile"];

const useAuth = () => {
  const queryClient = useQueryClient();

  const setToken = (token: string) => {
    Cookies.set("authToken", token);
  };

  const loginReq = async (login: string, senha: string) => {
    try {
      const response = await api.post("/auth/login", { login, senha });
      const { access_token } = response.data;
      setToken(access_token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const login = useMutation({
    mutationFn: ({ login, senha }: { login: string; senha: string }) =>
      loginReq(login, senha),
    onSuccess: () => {
      toast.success("Seja bem vindo!");
      profile.refetch();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });

  const profileReq = async (): Promise<User | undefined> => {
    try {
      const response: AxiosResponse<UserProfile> =
        await api.get("/auth/profile");

      return {
        codigo_usuario: response.data.codigo_usuario,
        nome_completo: response.data.nome_completo,
        email: response.data.email,
        perfil: response.data.perfil as User["perfil"],
        escola: response.data.escola || null,
        escolaId: response.data.escolaId || null,
      };
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const profile = useQuery({
    queryFn: () => profileReq(),
    queryKey: USER_PROFILE_QUERY_KEY,
    enabled: !!Cookies.get("authToken"),
  });

  const logout = () => {
    Cookies.remove("authToken");
    queryClient.cancelQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
  };

  const checkLoggedIn = useCallback(async () => {
    const token = Cookies.get("authToken");

    if (!token) {
      return false;
    }

    try {
      if (!profile.data) {
        logout();
        return false;
      }

      return true;
    } catch (_error) {
      logout();
      return false;
    }
  }, [profile.data]);

  return { checkLoggedIn, login, profile, logout };
};

export default useAuth;
