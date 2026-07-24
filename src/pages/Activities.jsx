import { useState, useEffect} from 'react';
import { 
  Activity, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Check, 
  AlertTriangle,
  Inbox
} from 'lucide-react';
import { activityApi } from '../api/activityApi';

export const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null); // Null for Create, Object for Edit
  
  // Form Inputs State
  const [formData, setFormData] = useState({ activityCode: '', activityName: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
// Reload function for buttons and post-CRUD actions
  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await activityApi.getAllActivities();
      setActivities(data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Data Fetch on Mount
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await activityApi.getAllActivities();
        if (isMounted) {
          setActivities(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setSelectedActivity(null);
    setFormData({ activityCode: '', activityName: '' });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (activity) => {
    setSelectedActivity(activity);
    setFormData({
      activityCode: activity.activityCode,
      activityName: activity.activityName,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Modal for Delete Confirmation
  const handleOpenDeleteModal = (activity) => {
    setSelectedActivity(activity);
    setIsDeleteModalOpen(true);
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.activityCode && formData.activityCode !== 0) {
      errors.activityCode = 'Activity Code is required.';
    } else if (isNaN(formData.activityCode) || Number(formData.activityCode) < 0) {
      errors.activityCode = 'Activity Code must be a positive integer.';
    }

    if (!formData.activityName || !formData.activityName.trim()) {
      errors.activityName = 'Activity Name is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        activityCode: Number(formData.activityCode),
        activityName: formData.activityName.trim(),
      };

      if (selectedActivity) {
        // Edit Mode
        await activityApi.updateActivity(selectedActivity.activityCode, payload);
      } else {
        // Create Mode
        await activityApi.createActivity(payload);
      }

      setIsFormModalOpen(false);
      loadActivities();
    } catch (error) {
      console.error('Failed to save activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedActivity) return;

    setIsSubmitting(true);
    try {
      await activityApi.deleteActivity(selectedActivity.activityCode);
      setIsDeleteModalOpen(false);
      loadActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Activities based on Search Term
  const filteredActivities = activities.filter(
    (act) =>
      act.activityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(act.activityCode).includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-150">
      
      {/* 🟢 Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Activity Management
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Define and manage workshop manufacturing activities and operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadActivities}
            disabled={loading}
            className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 text-slate-600 dark:text-zinc-300 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center transition-all disabled:opacity-50 focus:outline-none"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 dark:text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="h-10 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all focus:outline-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* 🟢 Filter & Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Code or Activity Name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          Total: <span className="text-slate-900 dark:text-zinc-100 font-bold">{filteredActivities.length}</span>
        </div>
      </div>

      {/* 🟢 Data Content Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all">
        {loading ? (
          <div className="p-12 text-center text-amber-500 space-y-3">
            <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No activities found.</p>
          </div>
        ) : (
          <>
            {/* 🖥️ Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
                <thead className="bg-slate-50 dark:bg-zinc-950/60 text-slate-700 dark:text-zinc-400 uppercase text-xs border-b border-slate-200 dark:border-zinc-800 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-32">Code</th>
                    <th className="px-6 py-4">Activity Name</th>
                    <th className="px-6 py-4 text-right w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.activityCode} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-400 font-mono">
                        #{activity.activityCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-zinc-100">
                        {activity.activityName}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(activity)}
                            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                            title="Edit Activity"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(activity)}
                            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 Mobile Responsive Cards View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredActivities.map((activity) => (
                <div key={activity.activityCode} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                      #{activity.activityCode}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm mt-0.5">
                      {activity.activityName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(activity)}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(activity)}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 🟢 Create / Edit Modal Dialog */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100">
                {selectedActivity ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Activity Code
                </label>
                <input
                  type="number"
                  value={formData.activityCode}
                  onChange={(e) => setFormData({ ...formData, activityCode: e.target.value })}
                  disabled={Boolean(selectedActivity)} // Primary key disabled in edit mode
                  placeholder="e.g. 101"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 font-mono text-sm focus:outline-none transition-all disabled:opacity-60"
                />
                {formErrors.activityCode && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.activityCode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  placeholder="e.g. Stone Setting / Filing"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                />
                {formErrors.activityName && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.activityName}</p>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{selectedActivity ? 'Save Changes' : 'Create Activity'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 🟢 Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100">Delete Activity?</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-zinc-200">"{selectedActivity?.activityName}"</span> (#{selectedActivity?.activityCode})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Activities;