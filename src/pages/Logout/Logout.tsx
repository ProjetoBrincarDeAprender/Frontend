import useAuth from "@/hooks/Auth/useAuth";
import { useUser } from "@/hooks/User/useUser";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

export default function Logout() {
  const { logout } = useAuth();
  const { registerUser } = useUser();

  useEffect(() => {
    if (toast.getToasts().some((t) => t.id === "logging-out")) {
      return;
    }
    const loggingOut = toast("Saindo...", {
      id: "logging-out",
      duration: Infinity,
    });

    toast.dismiss(loggingOut);
    const performLogout = async () => {
      try {
        logout();
        registerUser(null);

        toast.dismiss("logging-out");
        toast.success("Desconectado com sucesso!");
      } catch (_error) {
        toast.dismiss("logging-out");
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
