import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import authApi from '../api/authApi';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await authApi.forgotPassword(email);
      // Navigate to Stage 2 passing email in state
      navigate('/verify-otp', { state: { email } });
    } catch {
      // Quiet navigation / fallback handling to prevent account enumeration
      navigate('/verify-otp', { state: { email } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Left Panel - Branding & Trust Proof */}
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
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Account Recovery Portal
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Secure, encrypted password recovery.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Verify your identity via a timed one-time passcode sent directly to your registered workshop email address.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Timed OTP
              </div>
              <p className="text-xs text-slate-400">Cryptographically secure 6-digit verification code.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Single-Use Token
              </div>
              <p className="text-xs text-slate-400">Short-lived action token for maximum vault security.</p>
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
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              Stage 1 of 3
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Forgot your password?</h1>
            <p className="text-sm text-slate-400 mt-2">
              Enter the email address associated with your workshop account and we will dispatch a 6-digit verification code.
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
                Workshop Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="admin@workshop.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                  disabled={isSubmitting}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-all"
                />
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
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Send Code</span>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 font-semibold text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;