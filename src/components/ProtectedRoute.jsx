import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Enterprise Route Guard Component
 * 
 * @param {Object} props
 * @param {string[]} [props.allowedRoles] - Array of required roles
 */
export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading state while checking refresh token / initial auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated check
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-based authorization check (Case-insensitive)
  if (allowedRoles.length > 0) {
    const userRoles = (user?.roles || []).map((role) => role.toLowerCase());
    const hasRequiredRole = allowedRoles.some((role) =>
      userRoles.includes(role.toLowerCase())
    );

    if (!hasRequiredRole) {
      // User is logged in, but lacks permission for this specific route
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. Authorized: Render child routes
  return <Outlet />;
};

export default ProtectedRoute;