// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, ThemeProvider } from './context'; 
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Real Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile'; 
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Activities from './pages/Activities';
import Processes from './pages/Processes';
import Jobs from './pages/Jobs';
import Inventory from './pages/Inventory';
import StockTransfers from './pages/StockTransfers';
import StockReturns from './pages/StockReturns';

// Helper component to redirect already authenticated users away from public auth pages
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500 space-y-3">
        <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-wide text-slate-400">Verifying session...</span>
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

const MyJobsPlaceholder = () => (
  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-2">
    <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">My Assigned Jobs</h1>
    <p className="text-slate-500 dark:text-zinc-400 text-sm">View and update jobs assigned to your queue.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Open Routes */}
            <Route 
              path="/login" 
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="/verify-otp" 
              element={
                <PublicOnlyRoute>
                  <VerifyOtp />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <PublicOnlyRoute>
                  <ResetPassword />
                </PublicOnlyRoute>
              } 
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes Pipeline */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/processes" element={<Processes />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/my-jobs" element={<MyJobsPlaceholder />} />
                <Route path="/stock-transfers" element={<StockTransfers />} />
                <Route path="/stock-returns" element={<StockReturns />} />
              </Route>
            </Route>

            {/* Fallback Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            visibleToasts={5}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}