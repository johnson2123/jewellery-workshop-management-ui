import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-zinc-950 p-4 text-slate-800 dark:text-zinc-100 font-sans relative overflow-hidden transition-colors duration-150">
      
      {/* Background Ambient Security Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 403 Card Container */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-200 dark:border-rose-500/20 max-w-md w-full text-center space-y-5 shadow-md dark:shadow-2xl relative z-10 transition-all duration-150">
        
        {/* Icon & 403 Badge */}
        <div className="flex items-center justify-center gap-2 mx-auto">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-center justify-center text-xl font-black shadow-inner">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Access Denied
          </h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            You do not have the required permissions or role assignment to view this workshop module.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-[0.98] text-slate-700 dark:text-zinc-300 font-semibold text-sm rounded-xl border border-slate-200 dark:border-transparent transition-all focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 active:scale-[0.98] font-medium text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Unauthorized;