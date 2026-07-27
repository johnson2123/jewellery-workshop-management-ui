import { useState, useEffect } from 'react';
import { ArrowDownLeft, Plus, Search, RefreshCw, Trash2, Edit3, Inbox, Layers, CheckSquare } from 'lucide-react';
import { stockTransferApi } from '../api/stockTransferApi';
import StockTransferModal from '../components/StockTransferModal';

export const StockReturns = () => {
  const [returns, setReturns] = useState([]);
  const [processMap, setProcessMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Reload function for manual refresh and post-submit actions
  const loadData = async () => {
    setLoading(true);
    try {
      const [transfersData, processOptions] = await Promise.all([
        stockTransferApi.getAllTransfers(),
        stockTransferApi.getProcessOptions()
      ]);

      const pMap = {};
      (processOptions || []).forEach(p => {
        pMap[String(p.code)] = p.name;
      });

      setProcessMap(pMap);
      setReturns(transfersData || []);
    } catch (err) {
      console.error('Failed to load stock returns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [transfersData, processOptions] = await Promise.all([
          stockTransferApi.getAllTransfers(),
          stockTransferApi.getProcessOptions()
        ]);

        if (isMounted) {
          const pMap = {};
          (processOptions || []).forEach(p => {
            pMap[String(p.code)] = p.name;
          });

          setProcessMap(pMap);
          setReturns(transfersData || []);
        }
      } catch (err) {
        console.error('Failed to load stock returns:', err);
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

  // Filter raw array to keep only return records ('TO') and handle casing variations
  const returnOnlyTransfers = returns.filter(item => {
    const direction = (item.fromOrTo || item.fromorto || item.FromOrTo || '').toUpperCase();
    return direction === 'TO';
  });

  // Group return line items by DocNo
  const groupedDocs = returnOnlyTransfers.reduce((acc, curr) => {
    const docNo = curr.docNo || curr.docno || curr.DocNo;
    const docDate = curr.docDate || curr.docdate || curr.DocDate;

    if (!acc[docNo]) {
      acc[docNo] = {
        docNo: docNo,
        docDate: docDate,
        lines: [],
        totalPieces: 0,
        totalGrossWeight: 0,
        totalGrossLoss: 0,
        totalPureLoss: 0,
      };
    }
    acc[docNo].lines.push(curr);
    acc[docNo].totalPieces += Number(curr.pieces || 0);
    acc[docNo].totalGrossWeight += Number(curr.grossWeight || curr.grqty || 0);
    acc[docNo].totalGrossLoss += Number(curr.grossWeightOfLoss || curr.grlossgain || 0);
    acc[docNo].totalPureLoss += Number(curr.pureWeightOfLoss || curr.pulossgain || 0);
    return acc;
  }, {});

  const docsList = Object.values(groupedDocs);

  const filteredDocs = docsList.filter(doc => 
    String(doc.docNo).includes(searchTerm) ||
    doc.lines.some(l => {
      const pCode = String(l.processCode || l.processcode || '');
      const pName = processMap[pCode] || '';
      return (
        pCode.includes(searchTerm) ||
        pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(l.jobCode || l.jobcode || '').includes(searchTerm) || 
        (l.stockCode || l.stkcode || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  const handleDelete = async (docNo) => {
    if (!window.confirm(`Are you sure you want to delete Return Document #${docNo}?`)) return;
    try {
      await stockTransferApi.deleteTransfer(docNo);
      loadData();
    } catch (err) {
      console.error('Failed to delete return document:', err);
    }
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
        <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
          Documents: <span className="text-slate-900 dark:text-zinc-100 font-bold">{filteredDocs.length}</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-emerald-500 space-y-2">
            <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading stock return documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-zinc-400 space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-slate-400 dark:text-zinc-600" />
            <p className="text-sm font-medium">No stock return documents found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredDocs.map(doc => (
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
                      {doc.lines.length} Line(s)
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
                      {doc.lines.map((line, idx) => {
                        const processCode = line.processCode || line.processcode;
                        const pName = processMap[String(processCode)];
                        
                        // Option 1 Format: #2002 - Vacuum Casting
                        const processDisplay = pName ? `#${processCode} - ${pName}` : `Process #${processCode}`;
                        
                        const jobCode = line.jobCode || line.jobcode;
                        const stockCode = line.stockCode || line.stkcode;
                        const pieces = line.pieces;
                        const grossWeight = line.grossWeight || line.grqty;
                        const grossLoss = line.grossWeightOfLoss || line.grlossgain;
                        const pureLoss = line.pureWeightOfLoss || line.pulossgain;
                        const isBooked = line.isBooked || line.isbooked;

                        return (
                          <tr key={idx}>
                            <td className="px-4 py-2 font-medium text-slate-900 dark:text-zinc-200">{processDisplay}</td>
                            <td className="px-4 py-2 font-mono">#{jobCode}</td>
                            <td className="px-4 py-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">{stockCode}</td>
                            <td className="px-4 py-2 text-right font-mono">{pieces}</td>
                            <td className="px-4 py-2 text-right font-mono font-semibold">{Number(grossWeight || 0).toFixed(2)} g</td>
                            <td className="px-4 py-2 text-right font-mono text-rose-500 font-semibold">{Number(grossLoss || 0).toFixed(3)} g</td>
                            <td className="px-4 py-2 text-right font-mono text-rose-400 font-semibold">{Number(pureLoss || 0).toFixed(3)} g</td>
                            <td className="px-4 py-2 text-center">
                              {isBooked ? (
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