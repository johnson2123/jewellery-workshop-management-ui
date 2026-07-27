import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { renderMenuIcon } from '../utils/iconMapper';

export const AppLayout = () => {
  const { user, menuList, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
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

  return (
    /* Root container locked to viewport height */
    <div className="h-screen w-screen overflow-hidden bg-slate-100 dark:bg-zinc-950 font-sans antialiased text-slate-800 dark:text-zinc-100 flex flex-col md:flex-row transition-colors duration-150">

      {/* 📱 Mobile Top Header */}
      <header className="md:hidden bg-white dark:bg-zinc-900 text-amber-500 dark:text-amber-400 h-16 px-4 flex items-center justify-between shrink-0 z-30 shadow-md dark:shadow-lg border-b border-slate-200 dark:border-zinc-800 transition-colors duration-150">
        <div className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-zinc-100">
          <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
          </div>
          <span className="tracking-wide text-base">Jewellery Workshop</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 rounded-xl flex items-center justify-center text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-zinc-800 transition-all focus:outline-none"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 rounded-xl flex items-center justify-center text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-zinc-800 transition-all focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 🗂️ Workshop Sidebar Navigation (Fixed full height, bottom-pinned sign out) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 h-full shrink-0 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 flex flex-col justify-between border-r border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-200/50 dark:shadow-none transition-all duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top & Scrollable Menu items */}
        <div className="flex flex-col min-h-0 overflow-y-auto">
          {/* Desktop Brand Header */}
          <div className="hidden md:flex h-20 items-center justify-between px-6 bg-slate-50/80 dark:bg-zinc-950/80 font-bold text-slate-900 dark:text-zinc-100 text-lg border-b border-slate-200 dark:border-zinc-800 shrink-0 transition-colors duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
              </div>
              <span className="tracking-wide text-base font-extrabold text-amber-500 dark:text-amber-400">
                Jewellery <span className="text-slate-900 dark:text-zinc-100">Workshop</span>
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="h-9 w-9 bg-slate-100 dark:bg-zinc-950 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-amber-400 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center transition-all focus:outline-none"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* 👤 User Profile Badge */}
          <NavLink
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `group relative block p-4 m-3 shrink-0 rounded-xl border transition-all text-left focus:outline-none focus:ring-1 focus:ring-amber-500/40 ${
                isActive
                  ? 'bg-slate-50 dark:bg-zinc-950 border-amber-500 shadow-md shadow-amber-500/5'
                  : 'bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200 dark:border-zinc-800 hover:border-amber-500/40 hover:bg-slate-100/60 dark:hover:bg-zinc-900/40'
              }`
            }
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-amber-600 dark:text-amber-400/90 uppercase font-extrabold tracking-wider">Logged in as</p>
              <span className="text-[10px] font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                View Profile <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate text-sm mt-0.5" title={user?.email || user?.userName}>
              {user?.email || user?.userName || 'Workshop Admin'}
            </p>

            {user?.roles && (
              <span className="inline-block mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-0.5 rounded-md border border-amber-500/20 font-semibold truncate max-w-full">
                {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
              </span>
            )}
          </NavLink>

          {/* Dynamic Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto">
            {menuList && menuList.map((item) => (
              <NavLink
                key={item.id || item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10'
                      : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-amber-600 dark:hover:text-amber-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {renderMenuIcon(
                      item.icon,
                      `w-4 h-4 stroke-[2.2] ${isActive ? 'text-slate-950' : 'text-amber-500 dark:text-amber-400/80'}`
                    )}
                    <span>{item.title}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Section (Pinned to bottom) */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full h-11 bg-slate-100 dark:bg-zinc-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30 active:scale-[0.98] text-slate-600 dark:text-zinc-300 font-semibold rounded-xl text-sm border border-slate-200 dark:border-zinc-800 flex items-center justify-center gap-2 transition-all focus:outline-none"
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
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-30 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 📄 Main Content Area (Independent scroll) */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100 dark:bg-zinc-950 transition-colors duration-150">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;