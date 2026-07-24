import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Enterprise Route Guard Component with Dynamic Menu Master Authorization
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, menuList } = useAuth();
  const location = useLocation();

  // Universal system routes accessible to any authenticated user
  const ALWAYS_ALLOWED_PATHS = ['/profile', '/unauthorized', '/dashboard'];

  // 1. Loading state while restoring session or menu items
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

  // 3. Dynamic Backend Menu Path Authorization
  const currentPath = location.pathname.toLowerCase();
  
  const isAllowedPath =
    ALWAYS_ALLOWED_PATHS.includes(currentPath) ||
    menuList.some((item) => item.path && item.path.toLowerCase() === currentPath);

  if (!isAllowedPath) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authorized: Render child routes
  return <Outlet />;
};

export default ProtectedRoute;