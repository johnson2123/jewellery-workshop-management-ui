import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import { ShieldCheck, KeyRound, Lock, ArrowRight, RefreshCw } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  // Step-based state: 'initial' | 'otp' | 'new_password'
  const [step, setStep] = useState('initial');
  
  const [otpCode, setOtpCode] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Step 1 -> Step 2: Request OTP
  const handleRequestOTP = async () => {
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // API integration placeholder: await authApi.requestPasswordResetOTP();
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate delay
      
      setStatusMessage({ type: 'success', text: `Verification code sent to ${user?.email}.` });
      setStep('otp');
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: 'Failed to send verification code. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Step 2 -> Step 3: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit code.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // API integration placeholder: await authApi.verifyPasswordResetOTP(otpCode);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

      setStatusMessage({ type: 'success', text: 'Verification successful. Please set your new password.' });
      setStep('new_password');
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: 'Invalid or expired OTP code.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Step 3 -> Finish: Submit New Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // Call actual endpoint with collected OTP + new password
      await authApi.changePassword({
        otp: otpCode,
        newPassword: passwordData.newPassword
      });

      setStatusMessage({ type: 'success', text: 'Your password has been changed successfully.' });
      handleResetFlow();
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: 'Failed to update your password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset wizard state back to original
  const handleResetFlow = () => {
    setStep('initial');
    setOtpCode('');
    setPasswordData({ newPassword: '', confirmPassword: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const renderRoles = () => {
    if (!user?.roles) return null;
    const rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];
    return rolesArray.map((role, idx) => (
      <span 
        key={idx} 
        className="inline-block px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded font-sans"
      >
        {role}
      </span>
    ));
  };

  return (
    <div className="p-6 max-w-5xl text-slate-800 dark:text-zinc-100 transition-colors duration-150">
      {/* Title section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Account Settings</h1>
        <p className="text-slate-600 dark:text-zinc-400 mt-1">Review your credentials and manage your account security.</p>
      </div>

      {/* Global/Status Messages */}
      {statusMessage.text && (
        <div className={`p-4 mb-6 rounded-xl text-sm border transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
            : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: Account Details */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm transition-colors duration-150">
          <div>
            <h2 className="text-lg font-bold mb-6 text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <span>Account Details</span>
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Username
                </label>
                <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-zinc-300 text-sm font-mono transition-colors duration-150">
                  {user?.userName || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Email Address
                </label>
                <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-zinc-300 text-sm font-mono transition-colors duration-150">
                  {user?.email || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                  Assigned Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {renderRoles() || <span className="text-sm text-slate-500">No roles assigned</span>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/60 text-xs text-slate-500">
            Account details are managed by system administrators.
          </div>
        </div>

        {/* Right Card: Dynamic Wizard Step Security Settings */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between min-h-87.5 shadow-sm transition-all duration-150">
          
          {/* STEP 1: INITIAL STATE */}
          {step === 'initial' && (
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-lg font-bold mb-3 text-amber-600 dark:text-amber-400">Security Settings</h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
                  For your security, updating your password requires verification via a One-Time Password (OTP) sent to your registered email account.
                </p>

                <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800/80 rounded-xl flex items-start gap-3.5 transition-colors duration-150">
                  <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Multi-Factor Check</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">We will request an approval handshake before modification access is allowed.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/40">
                <button
                  type="button"
                  onClick={handleRequestOTP}
                  disabled={isSubmitting}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Begin Password Reset</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-lg font-bold mb-2 text-amber-600 dark:text-amber-400">Enter OTP Code</h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">
                  Enter the 6-digit security code sent to your email to verify your identity.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="0 0 0 0 0 0"
                      required
                      className="w-full text-center tracking-[0.5em] px-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 font-mono text-xl focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/40 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="w-1/3 h-11 bg-slate-100 dark:bg-zinc-850 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl text-sm border border-slate-200 dark:border-transparent transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length < 6}
                  className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify Identity</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: RESET FORM */}
          {step === 'new_password' && (
            <form onSubmit={handleChangePassword} className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-lg font-bold mb-2 text-amber-600 dark:text-amber-400">Set New Password</h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">
                  Identity verified. Please create a robust password for secure access.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/40 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="w-1/3 h-11 bg-slate-100 dark:bg-zinc-850 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl text-sm border border-slate-200 dark:border-transparent transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save Password</span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}