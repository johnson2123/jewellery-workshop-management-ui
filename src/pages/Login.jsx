import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!credentials.email || !credentials.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Left Panel - Branding & Trust Proof (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-slate-900 via-amber-950/40 to-slate-900 p-12 flex-col justify-between border-r border-amber-500/20">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20 text-slate-950">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-amber-400 block">Jewellery Workshop</span>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Management System</span>
          </div>
        </div>

        {/* Center Hero Section */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Secure Vault & Job Card Tracking
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Precision control for custom jewellery production.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Monitor metal inventory, issue job cards to karigars, track ornament weights, and streamline workshop operations.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Karigar Tracking
              </div>
              <p className="text-xs text-slate-400">Manage piece rates, issue/returns & metal wastage.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Metal Vault
              </div>
              <p className="text-xs text-slate-400">Real-time balances for Gold, Silver, and Alloy.</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between items-center border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} Jewellery Workshop ERP</span>
          <span className="hover:text-amber-400 transition-colors cursor-pointer">Security & Audit Governance</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold text-amber-400 block">Jewellery Workshop</span>
              <span className="text-xs text-slate-400 font-medium">Management System</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Sign in to your account</h1>
            <p className="text-sm text-slate-400 mt-2">
              Enter your staff or admin credentials to access the workshop dashboard.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm font-medium flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="text"
                  name="email"
                  autoComplete="email"
                  placeholder="admin@workshop.com"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Workshop</span>
              )}
            </button>
          </form>

          {/* Registration Redirect */}
          <div className="pt-4 border-t border-slate-800 text-center text-sm text-slate-400">
            Need staff or artisan access?{' '}
            <Link to="/register" className="font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors">
              Request access
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;