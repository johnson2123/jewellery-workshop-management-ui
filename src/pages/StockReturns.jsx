import { useState, useEffect } from 'react';
import { ArrowDownLeft, Plus, Search, RefreshCw, Trash2, Edit3, Inbox, Layers, CheckSquare, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { stockTransferApi } from '../api/stockTransferApi';
import StockTransferModal from '../components/StockTransferModal';

export const StockReturns = () => {
  // Paginated Master Data States
  const [documents, setDocuments] = useState([]);
  const [processMap, setProcessMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting States
  const [sortBy, setSortBy] = useState('DocDate');
  const [isDescending, setIsDescending] = useState(true);

  // Cache reload key to safely trigger side effects without cascading updates
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Debounce search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Unified Side-Effect Data Synchronizer (Clears cascading state render warnings)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [returnsRes, processOptions] = await Promise.all([
          stockTransferApi.getPagedReturns({
            pageNumber,
            pageSize,
            searchTerm: debouncedSearch,
            sortBy,
            isDescending
          }),
          stockTransferApi.getProcessOptions()
        ]);

        if (!isMounted) return;

        // Map lookup codes safely
        const pMap = {};
        (processOptions || []).forEach(p => {
          pMap[String(p.code)] = p.name;
        });
        setProcessMap(pMap);

        // Bind items and metadata safely
        if (returnsRes) {
          setDocuments(returnsRes.items || []);
          setTotalCount(returnsRes.totalCount || 0);
          setTotalPages(returnsRes.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to load paginated workshop returns:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [pageNumber, pageSize, debouncedSearch, sortBy, isDescending, refreshKey]);

  // Safe manual refresh/reload trigger
  const loadData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setIsDescending(!isDescending);
    } else {
      setSortBy(field);
      setIsDescending(true);
    }
    setPageNumber(1);
  };

  const handleDelete = async (docNo) => {
    if (!window.confirm(`Are you sure you want to delete Return Document #${docNo}?`)) return;
    try {
      await stockTransferApi.deleteTransfer(docNo);
      loadData();
    } catch (err) {
      console.error('Failed to delete return document:', err);
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return isDescending 
      ? <ArrowDown className="w-3.5 h-3.5 text-emerald-500" /> 
      : <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100 font-sans antialiased">
      
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <ArrowDownLeft className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Workshop Stock Return
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Record returned metal, scrap balances, and manufacturing losses from workshop jobs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="h-10 w-10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => { setEditingDoc(null); setIsModalOpen(true); }}
            className="h-10 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Workshop Return</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Doc #, Process Code / Name, Job Code..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none"
          />
        </div>
        
        {/* Interactive Sorting Headers */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-400 dark:text-zinc-500">Sort by:</span>
          <button
            onClick={() => handleSort('DocNo')}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-semibold ${
              sortBy === 'DocNo'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Doc No</span>
            {renderSortIcon('DocNo')}
          </button>
          
          <button
            onClick={() => handleSort('DocDate')}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all font-semibold ${
              sortBy === 'DocDate'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Date</span>
            {renderSortIcon('DocDate')}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-emerald-500 space-y-2">
            <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading stock return documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No stock return documents found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {documents.map(doc => (
              <div key={doc.docNo} className="p-5 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs rounded-lg border border-emerald-500/20">
                      Doc #{doc.docNo}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {doc.docDate 
                        ? new Date(doc.docDate).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          }) 
                        : 'N/A'}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded font-semibold flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-500" />
                      {doc.totalLines} Line(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingDoc(doc); setIsModalOpen(true); }}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                      title="Edit Document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.docNo)}
                      className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-table preview with Gross Loss and Pure Loss columns */}
                <div className="overflow-x-auto border border-slate-100 dark:border-zinc-800/80 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-400">
                    <thead className="bg-slate-50 dark:bg-zinc-950/80 font-bold uppercase text-[10px] tracking-wider text-slate-400">
                      <tr>
                        <th className="px-4 py-2">Process / Department</th>
                        <th className="px-4 py-2">Job Number</th>
                        <th className="px-4 py-2">Stock Item</th>
                        <th className="px-4 py-2 text-right">Pieces</th>
                        <th className="px-4 py-2 text-right">Gross Weight</th>
                        <th className="px-4 py-2 text-right text-rose-500">Gross Loss</th>
                        <th className="px-4 py-2 text-right text-rose-400">Pure Loss</th>
                        <th className="px-4 py-2 text-center">Book</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                      {(doc.lines || []).map((line, idx) => {
                        const processCode = line.processCode;
                        const pName = processMap[String(processCode)];
                        const processDisplay = pName ? `#${processCode} - ${pName}` : `Process #${processCode}`;

                        return (
                          <tr key={idx}>
                            <td className="px-4 py-2 font-medium text-slate-900 dark:text-zinc-200">{processDisplay}</td>
                            <td className="px-4 py-2 font-mono">#{line.jobCode}</td>
                            <td className="px-4 py-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">{line.stockCode}</td>
                            <td className="px-4 py-2 text-right font-mono">{line.pieces}</td>
                            <td className="px-4 py-2 text-right font-mono font-semibold">{Number(line.grossWeight || 0).toFixed(2)} g</td>
                            <td className="px-4 py-2 text-right font-mono text-rose-500 font-semibold">{Number(line.grossWeightOfLoss || 0).toFixed(3)} g</td>
                            <td className="px-4 py-2 text-right font-mono text-rose-400 font-semibold">{Number(line.pureWeightOfLoss || 0).toFixed(3)} g</td>
                            <td className="px-4 py-2 text-center">
                              {line.isBooked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-500 mx-auto" />
                              ) : (
                                <span className="text-slate-300 dark:text-zinc-700">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Pagination Footer */}
        {totalCount > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-950/45 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>Displaying</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }}
                className="px-2 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 font-bold focus:outline-none"
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>{size} rows</option>
                ))}
              </select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Page <strong className="text-slate-900 dark:text-zinc-100">{pageNumber}</strong> of {totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                  className="p-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg transition-all disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pageNumber === totalPages}
                  onClick={() => setPageNumber(p => Math.min(p + 1, totalPages))}
                  className="p-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg transition-all disabled:opacity-40 disabled:hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <StockTransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        mode="RETURN"
        editDocument={editingDoc}
      />
    </div>
  );
};

export default StockReturns;