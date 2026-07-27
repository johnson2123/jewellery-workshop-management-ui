import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  XCircle,
  ShieldCheck
} from 'lucide-react';
import authApi from '../api/authApi';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const target = location.state?.target || '';
  const actionToken = location.state?.actionToken || '';

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Guard: Redirect back if missing authorization token
  useEffect(() => {
    if (!target || !actionToken) {
      navigate('/forgot-password', { replace: true });
    }
  }, [target, actionToken, navigate]);

  // Live password complexity checks matching backend regex rules ([^a-zA-Z0-9])
  const passwordCriteria = {
    length: formData.newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(formData.newPassword),
    hasLower: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    hasSpecial: /[^a-zA-Z0-9]/.test(formData.newPassword),
    matches: formData.newPassword.length > 0 && formData.newPassword === formData.confirmPassword
  };

  const isFormValid = Object.values(passwordCriteria).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMsg('Please satisfy all password security requirements before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Call C# reset password endpoint (ResetPasswordRequest)
      await authApi.resetPassword({
        target,
        actionToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setIsSuccess(true);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch {
      setErrorMsg('Failed to reset password. The security token may have expired.');
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
            Credential Vault Update
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Set your new workshop password.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Your identity has been verified. Create a complex, non-reusable password to protect workshop operations.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Atomic Reset
              </div>
              <p className="text-xs text-slate-400">Previous tokens and sessions invalidated immediately.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Policy Compliant
              </div>
              <p className="text-xs text-slate-400">Enforces non-alphanumeric special character policies.</p>
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

          {isSuccess ? (
            /* Success State Confirmation */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl">
                <ShieldCheck className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Password Updated!</h2>
                <p className="text-sm text-slate-400">
                  Your password has been changed successfully. Redirecting you to the sign-in page...
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          ) : (
            /* Password Reset Form */
            <>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
                  Stage 3 of 3
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create new password</h1>
                <p className="text-sm text-slate-400 mt-2">
                  Resetting password for <span className="text-amber-400 font-semibold">{target}</span>.
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
                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="••••••••••••"
                      value={formData.newPassword}
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
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="••••••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-xs">
                  <span className="font-semibold text-slate-300 block mb-1">Password Requirements:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>8+ Characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.hasUpper ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Uppercase Letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.hasLower ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Lowercase Letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Special Character</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.matches ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.matches ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Passwords Match</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full h-12 mt-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default ResetPassword;