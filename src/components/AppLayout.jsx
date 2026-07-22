import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Coins,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Cards / Orders', path: '/orders', icon: Briefcase },
    { name: 'Artisans / Karigars', path: '/artisans', icon: Users },
    { name: 'Metal Inventory', path: '/inventory', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 flex flex-col md:flex-row">

      {/* 📱 Mobile Top Header */}
      <header className="md:hidden bg-slate-900 text-amber-400 h-16 px-4 flex items-center justify-between sticky top-0 z-30 shadow-lg border-b border-amber-500/20">
        <div className="flex items-center gap-2.5 font-bold text-lg text-white">
          <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
          </div>
          <span className="tracking-wide text-base">Jewellery Workshop</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-10 w-10 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* 🗂️ Workshop Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-amber-500/20 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Desktop Brand Header */}
          <div className="hidden md:flex h-20 items-center gap-3 px-6 bg-slate-950/80 font-bold text-white text-lg border-b border-amber-500/20">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
            </div>
            <span className="tracking-wide text-base font-extrabold text-amber-400">
              Jewellery <span className="text-white">Workshop</span>
            </span>
          </div>

          {/* User Profile Badge */}
          <div className="p-4 m-3 bg-slate-950 rounded-xl border border-amber-500/20">
            <p className="text-[10px] text-amber-400/90 uppercase font-extrabold tracking-wider">Logged in as</p>
            <p className="font-semibold text-white truncate text-sm mt-0.5" title={user?.email || user?.userName}>
              {user?.email || user?.userName || 'Workshop Admin'}
            </p>
            {user?.roles && (
              <span className="inline-block mt-2 bg-amber-500/10 text-amber-400 text-xs px-2.5 py-0.5 rounded-md border border-amber-500/20 font-semibold truncate max-w-full">
                {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-amber-400'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-slate-950' : 'text-amber-400/80'}`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full h-11 bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/30 active:scale-[0.98] text-slate-300 font-semibold rounded-xl text-sm border border-slate-700/60 flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 📄 Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;