import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SessionStatus from "./SessionStatus";
export default function RequireAdmin() {
  const { user, loading, error, isAdmin } = useAuth();
  if (loading || error) return <SessionStatus />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <SessionStatus />;
  return <Outlet />;
}
