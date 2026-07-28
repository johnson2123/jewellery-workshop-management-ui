import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Edit2, 
  X, 
  Loader2,
  Inbox,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { userManagementApi } from '../api/userManagementApi';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Grid & Pagination State
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState('CreatedAt');
  const [isDescending, setIsDescending] = useState(true);

  // Modals State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [createForm, setCreateForm] = useState({
    email: '',
    employeeId: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'User'
  });

  const [editForm, setEditForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'User'
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { pageNumber, pageSize, sortBy, isDescending };
      if (searchTerm) params.searchTerm = searchTerm;
      if (roleFilter) params.roleFilter = roleFilter;
      if (isActiveFilter !== '') params.isActiveFilter = isActiveFilter;

      const res = await userManagementApi.getUsers(params);
      setUsers(res?.items || []);
      setTotalCount(res?.totalCount || 0);
      setTotalPages(res?.totalPages || 1);
    } catch {
      // Automatic error handling via apiClient interceptor
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm, roleFilter, isActiveFilter, sortBy, isDescending]);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const params = { pageNumber, pageSize, sortBy, isDescending };
        if (searchTerm) params.searchTerm = searchTerm;
        if (roleFilter) params.roleFilter = roleFilter;
        if (isActiveFilter !== '') params.isActiveFilter = isActiveFilter;

        const res = await userManagementApi.getUsers(params);

        if (active) {
          setUsers(res?.items || []);
          setTotalCount(res?.totalCount || 0);
          setTotalPages(res?.totalPages || 1);
        }
      } catch {
        // Automatic error handling via apiClient interceptor
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [pageNumber, pageSize, searchTerm, roleFilter, isActiveFilter, sortBy, isDescending]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setIsDescending(!isDescending);
    } else {
      setSortBy(field);
      setIsDescending(true);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await userManagementApi.createUser(createForm);
      setShowCreateModal(false);
      setCreateForm({ email: '', employeeId: '', password: '', firstName: '', lastName: '', phoneNumber: '', role: 'User' });
      fetchUsers();
    } catch {
      // Handled by apiClient interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);

    try {
      await userManagementApi.updateUser(editingUser.id, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch {
      // Handled by apiClient interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await userManagementApi.toggleStatus(user.id, !user.isActive);
      fetchUsers();
    } catch {
      // Handled by apiClient interceptor
    }
  };

  const startRange = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRange = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 text-slate-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-150">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-md dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden transition-all duration-150">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">User Administration</h1>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1">
            Provision staff accounts, assign roles, and manage access privileges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 text-slate-600 dark:text-zinc-300 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center transition-all disabled:opacity-50 focus:outline-none"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 dark:text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all focus:outline-none"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md dark:shadow-none overflow-hidden transition-all">
        
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search name, email or employee ID..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPageNumber(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPageNumber(1); }}
              className="px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User (Artisan)</option>
            </select>

            <select
              value={isActiveFilter}
              onChange={(e) => { setIsActiveFilter(e.target.value); setPageNumber(1); }}
              className="px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Locked Only</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-3">
            <Loader2 className="w-8 h-8 mx-auto text-amber-500 animate-spin" />
            <p className="text-xs font-medium">Fetching accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No accounts found matching search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
              <thead className="bg-slate-100/50 dark:bg-zinc-950/60 text-slate-700 dark:text-zinc-400 uppercase text-xs border-b border-slate-200 dark:border-zinc-800 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">S.No</th>
                  <th className="px-5 py-3.5 cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort('UserName')}>
                    <div className="flex items-center gap-1">
                      <span>Employee ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort('LastName')}>
                    <div className="flex items-center gap-1">
                      <span>Full Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort('Email')}>
                    <div className="flex items-center gap-1">
                      <span>Email / Contact</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {users.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-4 text-center text-xs font-semibold text-slate-400">
                      {(pageNumber - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-5 py-4 font-bold text-amber-600 dark:text-amber-400">{u.employeeId}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-zinc-100">{u.lastName}, {u.firstName}</td>
                    <td className="px-5 py-4 text-xs">
                      <p className="text-slate-800 dark:text-zinc-200 font-medium">{u.email}</p>
                      <p className="text-slate-400">{u.phoneNumber || 'No phone'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                        {u.roles?.[0] || 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        u.isActive 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                          : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                      }`}>
                        {u.isActive ? 'Active' : 'Locked'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setEditForm({ 
                            email: u.email, 
                            firstName: u.firstName, 
                            lastName: u.lastName, 
                            phoneNumber: u.phoneNumber || '', 
                            role: u.roles?.[0] || 'User' 
                          });
                        }}
                        className="p-1.5 text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                        title="Edit Parameters"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`p-1.5 transition-colors ${
                          u.isActive 
                            ? 'text-slate-500 hover:text-red-500' 
                            : 'text-slate-500 hover:text-emerald-500'
                        }`}
                        title={u.isActive ? 'Lock Account' : 'Unlock Account'}
                      >
                        {u.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }}
              className="px-2 py-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>

          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-zinc-200">{startRange}</span> to <span className="font-semibold text-slate-800 dark:text-zinc-200">{endRange}</span> of <span className="font-semibold text-slate-800 dark:text-zinc-200">{totalCount}</span> users
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700 dark:text-zinc-300">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(p + 1, totalPages))}
              disabled={pageNumber >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal: Create User */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Provision Staff Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">First Name</label>
                  <input 
                    type="text" required
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Last Name</label>
                  <input 
                    type="text" required
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Employee ID</label>
                  <input 
                    type="text" required placeholder="EMP-1001"
                    value={createForm.employeeId}
                    onChange={(e) => setCreateForm({...createForm, employeeId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Role</label>
                  <select 
                    value={createForm.role}
                    onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  >
                    <option value="User">User (Artisan)</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Email Address</label>
                  <input 
                    type="email" required placeholder="staff@workshop.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Phone Number</label>
                  <input 
                    type="text" placeholder="+919876543210"
                    value={createForm.phoneNumber}
                    onChange={(e) => setCreateForm({...createForm, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Initial Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/10 flex items-center gap-1"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Edit Account Parameters</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">First Name</label>
                  <input 
                    type="text" required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Last Name</label>
                  <input 
                    type="text" required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Email Address</label>
                  <input 
                    type="email" required
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Phone Number</label>
                  <input 
                    type="text" placeholder="+919876543210"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Role</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
                >
                  <option value="User">User (Artisan)</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/10 flex items-center gap-1"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}