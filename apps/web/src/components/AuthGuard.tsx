import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const pathMap = {
  admin: "/admin",
  doctor: "/agenda-medico",
  patient: "/agendar",
}

export default function AuthGuard({ isPrivate }: { isPrivate: boolean }) {
  const { isAuthenticated, user } = useAuth();

  console.log(isAuthenticated)

  if (!isAuthenticated && isPrivate) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !isPrivate) {
    const path = pathMap[user.role.toLocaleLowerCase()];
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
}