import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  User, 
  Phone, 
  Shield, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    role: 'Karigar',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear timeout on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim() || null,
        role: formData.role,
        password: formData.password,
      };

      await register(payload);
      
      setSuccessMsg('Account created successfully! Redirecting to login...');
      timerRef.current = setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // apiClient.js already formats C# validation arrays into a clean err.message
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Left Panel - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-slate-900 via-amber-950/40 to-slate-900 p-12 flex-col justify-between border-r border-amber-500/20">
        
        {/* Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20 text-slate-950">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-amber-400 block">Jewellery Workshop</span>
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Management System</span>
          </div>
        </div>

        {/* Center Hero */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Staff & Artisan Onboarding
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Join the workshop management portal.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Create an account to begin tracking job cards, managing precious metal issues and returns, and monitoring daily production.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Role-based access tailored to Karigars, Staff, and Managers</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Real-time tracking of metal weight, wastage, and piece rates</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between items-center border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} Jewellery Workshop ERP</span>
          <span>Security & Audit Standard v2.4</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold text-amber-400 block">Jewellery Workshop</span>
              <span className="text-xs text-slate-400 font-medium">Management System</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Request Account Access</h1>
            <p className="text-sm text-slate-400 mt-1">
              Fill in your details below to register your workshop account.
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm font-medium flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-sm font-medium flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="john.doe@workshop.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone & Role */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    autoComplete="tel"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Account Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full h-11 px-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  <option value="Karigar">Karigar / Artisan</option>
                  <option value="Staff">Workshop Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full h-11 px-3 pr-8 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 px-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-2 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors">
              Sign in
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;