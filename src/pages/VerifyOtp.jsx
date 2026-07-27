import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import authApi from '../api/authApi';
import OtpInput from '../components/OtpInput';

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetEmail = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  // Fallback guard if user accesses /verify-otp directly without target email
  useEffect(() => {
    if (!targetEmail) {
      navigate('/forgot-password', { replace: true });
    }
  }, [targetEmail, navigate]);

  // 60-second cooldown interval timer for resending OTPs
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Verify OTP against C# endpoint (VerifyOtpRequest: Target, OtpCode, Purpose)
      const result = await authApi.verifyOtp({
        target: targetEmail,
        otpCode: code,
        purpose: 'ForgotPassword'
      });

      // Pass target and actionToken (VerifyOtpResult) to Stage 3
      navigate('/reset-password', {
        state: {
          target: targetEmail,
          actionToken: result.actionToken
        }
      });
    } catch {
      setErrorMsg('Invalid or expired verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;

    try {
      setErrorMsg('');
      await authApi.forgotPassword(targetEmail);
      setCooldown(60);
      setOtp(['', '', '', '', '', '']);
    } catch {
      setCooldown(60);
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
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Identity Verification
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Confirm your access request.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Enter the 6-digit security code issued to your email to unlock password authorization.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Flood Protection
              </div>
              <p className="text-xs text-slate-400">Strict 60-second cooldown rate limiting enforced.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Attempt Counter
              </div>
              <p className="text-xs text-slate-400">Maximum 3 verification attempts per session.</p>
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
              Stage 2 of 3
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Enter verification code</h1>
            <p className="text-sm text-slate-400 mt-2">
              We sent a 6-digit code to <span className="font-semibold text-amber-400">{targetEmail}</span>.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm font-medium flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                6-Digit Security Passcode
              </label>
              
              {/* Segmented OTP Input Component */}
              <OtpInput 
                value={otp} 
                onChange={(val) => {
                  setOtp(val);
                  if (errorMsg) setErrorMsg('');
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join('').length !== 6}
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>
          </form>

          {/* Resend Code Section with Cooldown Timer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={cooldown > 0 || isSubmitting}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${cooldown === 0 ? 'animate-spin-once' : ''}`} />
              <span>
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend verification code'}
              </span>
            </button>

            <Link 
              to="/forgot-password" 
              className="inline-flex items-center gap-2 font-semibold text-slate-400 hover:text-white transition-colors text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change target email</span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default VerifyOtp;