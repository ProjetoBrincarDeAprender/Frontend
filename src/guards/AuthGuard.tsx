import { useUser } from "@/hooks/User/useUser";
import { Navigate, Outlet } from "react-router";

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
    return <Navigate to={redirectTo} replace />;
  }

  if (role && user && !role.includes(user?.perfil)) {
    // Quando adicionar o Toast lembrar de atualizar isso
    alert("Acesso negado: você não tem permissão para acessar esta página.");
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
