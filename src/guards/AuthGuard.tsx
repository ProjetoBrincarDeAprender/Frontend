import { useUser } from "@/hooks/User/useUser";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

interface AuthGuardProps {
  redirectTo?: string;
  requireAuth?: boolean;
  role?: string[];
}

export const AuthGuard = ({
  redirectTo = "/login",
  requireAuth = true,
  role,
}: AuthGuardProps) => {
  const { user } = useUser();

  if (requireAuth && !user) {
    toast.error("Você precisa estar logado para acessar esta página.");
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAuth && role && user && !role.includes(user?.perfil)) {
    toast.error("Você não tem permissão para acessar esta página.");
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
