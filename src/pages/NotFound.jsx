import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-slate-100 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 404 Card Container */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-amber-500/20 max-w-md w-full text-center space-y-5 shadow-2xl relative z-10">
        
        {/* Icon & 404 Badge */}
        <div className="flex items-center justify-center gap-2 mx-auto">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center text-xl font-black shadow-inner">
            404
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The workshop route or module you are looking for does not exist or has been relocated.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>Return to Workshop Overview</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;