import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Hammer, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Scale, 
  UserCheck,
  Inbox
} from 'lucide-react';

export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  // Active Job Cards (Ready for ASP.NET Core API integration)
  const [jobCards] = useState([
    { id: 'JC-2026-081', item: '22K Gold Necklace', customer: 'Anand Jewels', artisan: 'Ramesh (Karigar)', metal: '22K Gold', weight: '45.2g', stage: 'Casting', status: 'In Progress' },
    { id: 'JC-2026-082', item: 'Diamond Engagement Ring', customer: 'Private Order', artisan: 'Suresh Kumar', metal: '18K White Gold', weight: '6.8g', stage: 'Stone Setting', status: 'In Progress' },
    { id: 'JC-2026-083', item: 'Silver Temple Bangle', customer: 'Heritage Crafts', artisan: 'Mahesh Sharma', metal: '925 Silver', weight: '110.0g', stage: 'Polishing', status: 'Ready for QC' },
    { id: 'JC-2026-084', item: 'Gold Earring Set', customer: 'Royal Jewellers', artisan: 'Unassigned', metal: '22K Gold', weight: '18.5g', stage: 'Design Approved', status: 'Pending' },
  ]);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulating API fetch delay (Replace with Axios call to backend controller)
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    toast.success('Dashboard metrics updated.');
  };

  const filteredJobs = jobCards.filter((job) => {
    if (filter === 'All') return true;
    return job.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 text-slate-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-150">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-md dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden transition-all duration-150">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Workshop Overview</h1>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1">
            Track active job cards, Karigar allocations, and metal weights in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 text-slate-600 dark:text-zinc-300 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center transition-all disabled:opacity-50 focus:outline-none"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 dark:text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button className="h-10 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all focus:outline-none">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Job Card</span>
          </button>
        </div>
      </div>

      {/* Workshop Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-200/50 dark:shadow-none transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400/80 uppercase tracking-wider">Active Job Cards</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 mt-2">24</p>
            </div>
            {/* Dark Anchor Icon Badge */}
            <div className="p-3 bg-zinc-900 dark:bg-amber-500/10 text-amber-400 border border-transparent dark:border-amber-500/20 rounded-xl shadow-md dark:shadow-none">
              <Hammer className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Total Allocated Weight: <span className="text-slate-800 dark:text-zinc-200 font-semibold">180.5g</span>
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-200/50 dark:shadow-none transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400/80 uppercase tracking-wider">Pending Karigar Assignment</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-amber-400 mt-2">5</p>
            </div>
            {/* Dark Anchor Icon Badge */}
            <div className="p-3 bg-zinc-900 dark:bg-amber-500/10 text-amber-400 border border-transparent dark:border-amber-500/20 rounded-xl shadow-md dark:shadow-none">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">Awaiting artisan sign-off</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-200/50 dark:shadow-none transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400/80 uppercase tracking-wider">Ready for QC / Delivery</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">7</p>
            </div>
            {/* Dark Anchor Icon Badge */}
            <div className="p-3 bg-zinc-900 dark:bg-emerald-500/10 text-emerald-400 border border-transparent dark:border-emerald-500/20 rounded-xl shadow-md dark:shadow-none">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">Final polish completed</p>
        </div>

      </div>

      {/* Production Table Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-150">
        
        {/* Table Controls Header */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Live Production Jobs</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Monitor gold/silver job card stages in real-time</p>
          </div>

          {/* Filter Options */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-x-auto">
            {['All', 'In Progress', 'Pending', 'Ready for QC'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none ${
                  filter === status
                    ? 'bg-amber-50 text-slate-950 shadow-sm'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State standard fallback */}
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No job cards match the status "{filter}".</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
                <thead className="bg-slate-100/50 dark:bg-zinc-950/60 text-slate-700 dark:text-zinc-400 uppercase text-xs border-b border-slate-200 dark:border-zinc-800 font-semibold tracking-wider transition-colors duration-150">
                  <tr>
                    <th className="px-5 py-3.5">Job ID</th>
                    <th className="px-5 py-3.5">Item & Customer</th>
                    <th className="px-5 py-3.5">Karigar (Artisan)</th>
                    <th className="px-5 py-3.5">Metal & Weight</th>
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-amber-600 dark:text-amber-400">{job.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-zinc-100">{job.item}</p>
                        <p className="text-xs text-slate-500">{job.customer}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-700 dark:text-zinc-300 font-medium">{job.artisan}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-zinc-300">
                        <span className="font-medium text-slate-800 dark:text-zinc-200">{job.metal}</span>
                        <span className="text-slate-500 text-xs ml-1.5">({job.weight})</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-all">
                          {job.stage}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden divide-y divide-slate-200 dark:divide-zinc-800">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{job.id}</span>
                      <p className="text-xs text-slate-500">{job.customer}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs space-y-1.5 transition-colors">
                    <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{job.item}</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-zinc-400 pt-1">
                      <p><span className="text-slate-550 dark:text-zinc-500">Metal:</span> {job.metal} ({job.weight})</p>
                      <p><span className="text-slate-550 dark:text-zinc-550">Karigar:</span> {job.artisan}</p>
                      <p><span className="text-slate-550 dark:text-zinc-550">Stage:</span> {job.stage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Ready for QC': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    'Pending': 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    'In Progress': 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/20',
  };

  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap transition-all ${styles[status] || 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'}`}>
      {status}
    </span>
  );
};

export default Dashboard;