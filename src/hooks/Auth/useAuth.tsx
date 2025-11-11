import type { UserProfile } from "@/types/user";
import api from "@/utils/api";
import Cookies from "js-cookie";

const useAuth = () => {
  const setToken = (token: string) => {
    Cookies.set("authToken", token);
  };

  const login = async (login: string, senha: string) => {
    try {
      const response = await api.post("/auth/login", { login, senha });
      const { access_token } = response.data;
      setToken(access_token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const profile = async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data as UserProfile;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
  };

  const checkLoggedIn = () => {
    const token = Cookies.get("authToken");

    if (!token) {
      return false;
    }

    try {
      const request = async () => {
        const response = await api.get("/auth/profile");

        return response;
      };

      request()
        .then(() => {
          return true;
        })
        .catch((response) => {
          if (response.status !== 201 && response.status !== 200) {
            logout();
            return false;
          }
        });
    } catch {
      logout();
      return false;
    }
  };

  const isLoggedIn = checkLoggedIn();

  return { isLoggedIn, login, profile, logout };
};

export default useAuth;
