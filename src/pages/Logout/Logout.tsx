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
    const loggingOut = toast("Saindo...");

    logout();
    registerUser(null);

    toast.dismiss(loggingOut);
    toast.success("Desconectado com sucesso!");
  }, []);

  if (!Cookies.get("authToken")) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/login" replace />;
}
