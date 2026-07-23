// src/components/ProtectedRoute.jsx
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

  // 1. Loading state while checking refresh token / initial auth state (Aligned with Dark Theme)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500 space-y-3">
        <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-wide text-slate-400">Loading application...</span>
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