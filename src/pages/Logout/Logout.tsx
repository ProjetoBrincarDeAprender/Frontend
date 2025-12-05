import useAuth from "@/hooks/Auth/useAuth";
import { useUser } from "@/hooks/User/useUser";
import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

export default function Logout() {
  const hasLoggedOut = useRef(false);
  const { logout } = useAuth();
  const { registerUser } = useUser();

  useEffect(() => {
    if (hasLoggedOut.current) return;

    hasLoggedOut.current = true;

    const performLogout = async () => {
      const loggingOut = toast("Saindo...");

      try {
        logout();
        registerUser(null);

        toast.dismiss(loggingOut);
        toast.success("Desconectado com sucesso!");
      } catch (error) {
        toast.dismiss(loggingOut);
        toast.error("Erro ao fazer logout");
      }
    };

    performLogout();
  }, [logout, registerUser]);

  if (!Cookies.get("authToken")) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/login" replace />;
}
