import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { authApi } from '../api/authApi.js';
import { Lock, KeyRound, RefreshCw, Key, ShieldCheck, X } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenModal = () => {
    setStatusMessage({ type: '', text: '' });
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation password do not match.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setStatusMessage({ type: 'success', text: 'Password updated successfully. Please re-authenticate if prompted.' });
      setIsModalOpen(false);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      const serverError = error?.response?.data?.message || 'Failed to change password. Please check your current credentials.';
      setStatusMessage({ type: 'error', text: serverError });
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Global Status Banner */}
      {statusMessage.text && !isModalOpen && (
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
                  Username / Employee ID
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Phone Number
                </label>
                <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-zinc-300 text-sm font-mono transition-colors duration-150">
                  {user?.phoneNumber || 'N/A'}
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

        {/* Right Card: Security & Credentials Summary */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm transition-all duration-150">
          <div>
            <h2 className="text-lg font-bold mb-2 text-amber-600 dark:text-amber-400">Security & Credentials</h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6">
              Manage your password and active security status.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                    Password Status
                  </label>
                  <p className="text-sm font-mono text-slate-700 dark:text-zinc-300">••••••••••••</p>
                </div>
                <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Changing your password will revoke all active login sessions on other devices for security.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800/40">
            <button
              type="button"
              onClick={handleOpenModal}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Key className="w-4 h-4 stroke-[2.5]" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-1">Update Password</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">Enter your current password to set a new password.</p>

            {statusMessage.text && (
              <div className={`p-3 mb-4 rounded-xl text-xs border ${
                statusMessage.type === 'error' 
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' 
                  : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                  />
                  <Key className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="w-1/3 h-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}