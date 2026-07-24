import { useState, useEffect } from 'react';
import { 
  Coins, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Check, 
  AlertTriangle,
  Inbox,
  Percent,
  Layers
} from 'lucide-react';
import { itemApi } from '../api/itemApi';

export const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Null for Create, Object for Edit
  
  // Form Inputs State
  const [formData, setFormData] = useState({ itemCode: '', itemName: '', purity: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reload function
  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await itemApi.getAllItems();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to fetch metal items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Data Fetch on Mount
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await itemApi.getAllItems();
        if (isMounted) {
          setItems(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch metal items:', error);
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
    setSelectedItem(null);
    setFormData({ itemCode: '', itemName: '', purity: '' });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      itemCode: item.itemCode,
      itemName: item.itemName,
      purity: String(item.purity),
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Modal for Delete Confirmation
  const handleOpenDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.itemCode || !formData.itemCode.trim()) {
      errors.itemCode = 'Item Code is required (e.g. AU-22K).';
    }

    if (!formData.itemName || !formData.itemName.trim()) {
      errors.itemName = 'Item Name is required.';
    }

    if (formData.purity === '' || formData.purity === null || formData.purity === undefined) {
      errors.purity = 'Purity value is required.';
    } else if (isNaN(formData.purity) || Number(formData.purity) < 0 || Number(formData.purity) > 100) {
      errors.purity = 'Purity must be a number between 0 and 100.';
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
        itemCode: formData.itemCode.trim().toUpperCase(),
        itemName: formData.itemName.trim(),
        purity: Number(formData.purity),
      };

      if (selectedItem) {
        // Edit Mode
        await itemApi.updateItem(selectedItem.itemCode, payload);
      } else {
        // Create Mode
        await itemApi.createItem(payload);
      }

      setIsFormModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Failed to save metal item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      await itemApi.deleteItem(selectedItem.itemCode);
      setIsDeleteModalOpen(false);
      loadItems();
    } catch (error) {
      console.error('Failed to delete metal item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Items based on Search Term
  const filteredItems = items.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute stats
  const averagePurity = items.length > 0 
    ? (items.reduce((acc, cur) => acc + Number(cur.purity || 0), 0) / items.length).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-150">
      
      {/* 🟢 Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
              <Coins className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Metal Inventory
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Master repository for raw metals, purities, and metal stock classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadItems}
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
            <span>Add Metal</span>
          </button>
        </div>
      </div>

      {/* 🟢 Enterprise Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Metal Types</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mt-1">{items.length}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Avg. Purity Rating</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{averagePurity}%</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
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
            placeholder="Search by Code (e.g. AU-22K) or Metal Name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          Total: <span className="text-slate-900 dark:text-zinc-100 font-bold">{filteredItems.length}</span>
        </div>
      </div>

      {/* 🟢 Data Content Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all">
        {loading ? (
          <div className="p-12 text-center text-amber-500 space-y-3">
            <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading metal items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No metal items found.</p>
          </div>
        ) : (
          <>
            {/* 🖥️ Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
                <thead className="bg-slate-50 dark:bg-zinc-950/60 text-slate-700 dark:text-zinc-400 uppercase text-xs border-b border-slate-200 dark:border-zinc-800 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-36">Item Code</th>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Purity</th>
                    <th className="px-6 py-4 text-right w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredItems.map((item) => (
                    <tr key={item.itemCode} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-400 font-mono uppercase">
                        {item.itemCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-zinc-100">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20">
                          {Number(item.purity).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                            title="Edit Item"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                            title="Delete Item"
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
              {filteredItems.map((item) => (
                <div key={item.itemCode} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono uppercase">
                        {item.itemCode}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded font-bold">
                        {Number(item.purity).toFixed(2)}%
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                      {item.itemName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(item)}
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
                {selectedItem ? 'Edit Metal Item' : 'Add New Metal Item'}
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
                  Item Code
                </label>
                <input
                  type="text"
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  disabled={Boolean(selectedItem)} // Primary key disabled in edit mode
                  placeholder="e.g. AU-22K or AG-925"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 font-mono text-sm focus:outline-none transition-all uppercase placeholder:normal-case disabled:opacity-60"
                />
                {formErrors.itemCode && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.itemCode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g. 22 Karat Yellow Gold"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                />
                {formErrors.itemName && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.itemName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Purity (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                  placeholder="e.g. 91.60"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none transition-all"
                />
                {formErrors.purity && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.purity}</p>
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
                      <span>{selectedItem ? 'Save Changes' : 'Create Item'}</span>
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
              <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100">Delete Metal Item?</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-zinc-200">"{selectedItem?.itemName}"</span> ({selectedItem?.itemCode})? This action cannot be undone.
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

export default Inventory;