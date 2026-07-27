import { useState, useEffect, useCallback } from 'react';
import { 
  GitCommit, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Check, 
  AlertTriangle,
  Inbox,
  Activity,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { processApi } from '../api/processApi';
import { activityApi } from '../api/activityApi';

export const Processes = () => {
  const [processes, setProcesses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting States
  const [sortBy, setSortBy] = useState('ProcessCode');
  const [isDescending, setIsDescending] = useState(true);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null); 
  
  // Form Inputs State
  const [formData, setFormData] = useState({ processCode: '', processName: '', activityCode: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Lookup Data (Activities) once on mount
  useEffect(() => {
    let isMounted = true;
    const fetchLookups = async () => {
      try {
        const activityData = await activityApi.getAllActivities();
        if (isMounted) {
          setActivities(activityData || []);
        }
      } catch (error) {
        console.error('Failed to fetch activity lookups:', error);
      }
    };
    fetchLookups();
    return () => { isMounted = false; };
  }, []);

  // Fetch paginated processes based on dependencies
  const loadProcesses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await processApi.getPagedProcesses({
        pageNumber,
        pageSize,
        searchTerm: searchTerm.trim() || undefined,
        sortBy,
        isDescending
      });
      setProcesses(response.items || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch processes:', error);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm, sortBy, isDescending]);

  // Debounced search queries
  useEffect(() => {
    const handler = setTimeout(() => {
      loadProcesses();
    }, 300);
    return () => clearTimeout(handler);
  }, [loadProcesses]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(1); 
  };

  const handleActivityFilterChange = (e) => {
    setActivityFilter(e.target.value);
    setPageNumber(1);
  };

  // Helper map for fast Activity Name lookup
  const activityMap = activities.reduce((acc, act) => {
    acc[act.activityCode] = act.activityName;
    return acc;
  }, {});

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setSelectedProcess(null);
    setFormData({ 
      processCode: '', 
      processName: '', 
      activityCode: activities.length > 0 ? String(activities[0].activityCode) : '' 
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (process) => {
    setSelectedProcess(process);
    setFormData({
      processCode: process.processCode,
      processName: process.processName,
      activityCode: String(process.activityCode),
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Modal for Delete Confirmation
  const handleOpenDeleteModal = (process) => {
    setSelectedProcess(process);
    setIsDeleteModalOpen(true);
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.processCode && formData.processCode !== 0) {
      errors.processCode = 'Process Code is required.';
    } else if (isNaN(formData.processCode) || Number(formData.processCode) < 0) {
      errors.processCode = 'Process Code must be a positive integer.';
    }

    if (!formData.processName || !formData.processName.trim()) {
      errors.processName = 'Process Name is required.';
    }

    if (!formData.activityCode) {
      errors.activityCode = 'Please select a parent Activity.';
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
        processCode: Number(formData.processCode),
        processName: formData.processName.trim(),
        activityCode: Number(formData.activityCode),
      };

      if (selectedProcess) {
        await processApi.updateProcess(selectedProcess.processCode, payload);
      } else {
        await processApi.createProcess(payload);
      }

      setIsFormModalOpen(false);
      loadProcesses();
    } catch (error) {
      console.error('Failed to save process:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedProcess) return;

    setIsSubmitting(true);
    try {
      await processApi.deleteProcess(selectedProcess.processCode);
      setIsDeleteModalOpen(false);
      loadProcesses();
    } catch (error) {
      console.error('Failed to delete process:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering local processes subset with parent Activity criteria on top of search
  const filteredProcesses = processes.filter((proc) => {
    return !activityFilter || String(proc.activityCode) === activityFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-150">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <GitCommit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Process Management
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Configure detailed manufacturing sub-processes and bind them to high-level activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProcesses}
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
            <span>Add Process</span>
          </button>
        </div>
      </div>

      {/* Enterprise Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Processes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Linked Activities</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-1">{activities.length}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Filtered Items</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{filteredProcesses.length}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Filter className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Process Code or Name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Parent Activity Filter */}
          <select
            value={activityFilter}
            onChange={handleActivityFilterChange}
            className="w-full sm:w-48 px-3.5 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all cursor-pointer"
          >
            <option value="">All Activities</option>
            {activities.map((act) => (
              <option key={act.activityCode} value={act.activityCode}>
                #{act.activityCode} - {act.activityName}
              </option>
            ))}
          </select>

          {/* Sort By Field */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPageNumber(1);
            }}
            className="w-full sm:w-40 px-3.5 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all cursor-pointer"
          >
            <option value="ProcessCode">Sort by Code</option>
            <option value="ProcessName">Sort by Name</option>
          </select>

          {/* Direction Toggle */}
          <button
            onClick={() => {
              setIsDescending(!isDescending);
              setPageNumber(1);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 text-slate-700 dark:text-zinc-300 rounded-xl border border-slate-200 dark:border-zinc-800 font-semibold text-sm transition-all focus:outline-none flex items-center justify-center gap-2"
            title="Toggle Sort Direction"
          >
            <span>{isDescending ? 'Descending ⬇️' : 'Ascending ⬆️'}</span>
          </button>
        </div>
      </div>

      {/* Data Content Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all">
        {loading ? (
          <div className="p-12 text-center text-amber-500 space-y-3">
            <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading processes & activities...</p>
          </div>
        ) : filteredProcesses.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No processes found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
                <thead className="bg-slate-50 dark:bg-zinc-950/60 text-slate-700 dark:text-zinc-400 uppercase text-xs border-b border-slate-200 dark:border-zinc-800 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-32">Code</th>
                    <th className="px-6 py-4">Process Name</th>
                    <th className="px-6 py-4">Parent Activity</th>
                    <th className="px-6 py-4 text-right w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredProcesses.map((process) => (
                    <tr key={process.processCode} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-400 font-mono">
                        #{process.processCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-zinc-100">
                        {process.processName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-zinc-700">
                          <Activity className="w-3.5 h-3.5 text-amber-500" />
                          <span>{activityMap[process.activityCode] || `Activity #${process.activityCode}`}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(process)}
                            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                            title="Edit Process"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(process)}
                            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                            title="Delete Process"
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

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredProcesses.map((process) => (
                <div key={process.processCode} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                        #{process.processCode}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md font-medium">
                        {activityMap[process.activityCode] || `Act #${process.activityCode}`}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                      {process.processName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(process)}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(process)}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-950/40 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNumber(1);
                  }}
                  className="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>

              <div className="text-slate-500 dark:text-zinc-400">
                Showing <span className="font-bold text-slate-900 dark:text-zinc-100">{Math.min((pageNumber - 1) * pageSize + 1, totalCount)}</span> to <span className="font-bold text-slate-900 dark:text-zinc-100">{Math.min(pageNumber * pageSize, totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-zinc-100">{totalCount}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1 || loading}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-all focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                  Page {pageNumber} of {totalPages}
                </span>
                <button
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                  disabled={pageNumber === totalPages || loading}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-all focus:outline-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100">
                {selectedProcess ? 'Edit Process' : 'Add New Process'}
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
                  Process Code
                </label>
                <input
                  type="number"
                  value={formData.processCode}
                  onChange={(e) => setFormData({ ...formData, processCode: e.target.value })}
                  disabled={Boolean(selectedProcess)} 
                  placeholder="e.g. 201"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 font-mono text-sm focus:outline-none transition-all disabled:opacity-60"
                />
                {formErrors.processCode && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.processCode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Process Name
                </label>
                <input
                  type="text"
                  value={formData.processName}
                  onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                  placeholder="e.g. Prong Bending / Pre-Polishing"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                />
                {formErrors.processName && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.processName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Parent Activity
                </label>
                <select
                  value={formData.activityCode}
                  onChange={(e) => setFormData({ ...formData, activityCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Parent Activity...</option>
                  {activities.map((act) => (
                    <option key={act.activityCode} value={act.activityCode}>
                      #{act.activityCode} - {act.activityName}
                    </option>
                  ))}
                </select>
                {formErrors.activityCode && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.activityCode}</p>
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
                      <span>{selectedProcess ? 'Save Changes' : 'Create Process'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100">Delete Process?</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-zinc-200">"{selectedProcess?.processName}"</span> (#{selectedProcess?.processCode})? This action cannot be undone.
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

export default Processes;