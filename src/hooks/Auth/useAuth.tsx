import type { UserProfile } from "@/types/user";
import api from "@/utils/api";
import Cookies from "js-cookie";
import { useState } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setToken = (token: string) => {
    Cookies.set("authToken", token);
  };

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const { access_token } = response.data;
      setToken(access_token);
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
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

  return { isLoggedIn, login, profile };
};

export default useAuth;
