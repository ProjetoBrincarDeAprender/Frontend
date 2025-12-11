import useAuth from "@/hooks/Auth/useAuth";
import { useUser } from "@/hooks/User/useUser";
import { useEffect, useState } from "react";
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
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { user } = useUser();
  const { checkLoggedIn } = useAuth();

  useEffect(() => {
    const handleCheck = async () => {
      try {
        const isLogged = await checkLoggedIn();
        setIsAuthenticated(isLogged);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };

    handleCheck();
  }, [checkLoggedIn]);

  if (!isReady) {
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    toast.error("Você precisa estar logado para acessar esta página.");
    return <Navigate to={redirectTo} replace />;
  }

  if (
    requireAuth &&
    role &&
    isAuthenticated &&
    user &&
    !role.includes(user.perfil.toString())
  ) {
    toast.error("Você não tem permissão para acessar esta página.");
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
