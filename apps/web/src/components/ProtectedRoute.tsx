import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user?.role.toLowerCase() as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
