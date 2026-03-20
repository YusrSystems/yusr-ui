import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useYusrSelector } from "../../../state/hooks";

const ProtectedRoute = () =>
{
  const location = useLocation();
  const isAuthenticated = useYusrSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated)
  {
    return <Navigate to="/login" state={ { from: location } } replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
