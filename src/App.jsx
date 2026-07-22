import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Real Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Helper component to redirect already authenticated users away from Login/Register
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

// --- Temporary Module Placeholders for Nav Links ---

const OrdersPlaceholder = () => (
  <div className="bg-slate-900 border border-amber-500/20 p-8 rounded-2xl text-center space-y-2">
    <h1 className="text-2xl font-bold text-white">Job Cards & Orders Module</h1>
    <p className="text-slate-400 text-sm">Under development — will connect directly with your C# Order API.</p>
  </div>
);

const ArtisansPlaceholder = () => (
  <div className="bg-slate-900 border border-amber-500/20 p-8 rounded-2xl text-center space-y-2">
    <h1 className="text-2xl font-bold text-white">Artisans & Karigars Management</h1>
    <p className="text-slate-400 text-sm">Under development — track artisan piece rates, issues, and returns.</p>
  </div>
);

const InventoryPlaceholder = () => (
  <div className="bg-slate-900 border border-amber-500/20 p-8 rounded-2xl text-center space-y-2">
    <h1 className="text-2xl font-bold text-white">Metal & Stone Inventory</h1>
    <p className="text-slate-400 text-sm">Under development — vault stock, 22K/18K gold balances, and loss metrics.</p>
  </div>
);

// --- Main App Component ---

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Auth Context Provider */}
      <AuthProvider>
        <Routes>
          {/* Public Open Routes (Redirects to /dashboard if logged in) */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            } 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes Pipeline */}
          <Route element={<ProtectedRoute />}>
            {/* AppLayout wraps protected pages with the workshop header & sidebar */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<OrdersPlaceholder />} />
              <Route path="/artisans" element={<ArtisansPlaceholder />} />
              <Route path="/inventory" element={<InventoryPlaceholder />} />
            </Route>
          </Route>

          {/* Fallback Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}