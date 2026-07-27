import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { stockTransferApi } from '../api/stockTransferApi';

const DEFAULT_ROW = {
  docType: 'STF',
  processCode: '',
  jobCode: '',
  stockCode: '',
  pieces: 1,
  grossWeight: '',
  grossWeightOfLoss: 0,
  pureWeightOfLoss: 0,
  isBooked: false,
  fromOrTo: 'FROM', // Tracks line direction: 'FROM' (Issue) or 'TO' (Return)
  isNew: true // Flag to identify locally added rows
};

export const StockTransferModal = ({ isOpen, onClose, onSuccess, mode = 'ISSUE', editDocument = null }) => {
  const isReturnMode = mode === 'RETURN';
  const modalTitle = editDocument 
    ? `Edit Document #${editDocument.docNo}` 
    : isReturnMode ? 'New Workshop Return' : 'New Workshop Issue';

  // Dropdown options
  const [processOptions, setProcessOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Line items state
  const [rows, setRows] = useState([DEFAULT_ROW]);
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Lookups and Complete Document on Mount
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchLookupsAndDoc() {
      setOptionsLoading(true);
      try {
        const [procRes, jobRes, stockRes] = await Promise.all([
          stockTransferApi.getProcessOptions(),
          stockTransferApi.getJobOptions(),
          stockTransferApi.getStockOptions(),
        ]);

        if (!isMounted) return;

        const procs = procRes || [];
        const jobs = jobRes || [];
        const stocks = stockRes || [];

        setProcessOptions(procs);
        setJobOptions(jobs);
        setStockOptions(stocks);

        // If editing, fetch ALL lines for this document directly from database
        if (editDocument) {
          const fetchedLines = await stockTransferApi.getByDocNo(editDocument.docNo);
          const linesToUse = fetchedLines || editDocument.lines || [];

          if (isMounted) {
            setRows(linesToUse.map(line => {
              const pCode = line.processCode || line.processcode || '';
              const jCode = line.jobCode || line.jobcode || '';
              const sCode = line.stockCode || line.stkcode || '';
              const qty = line.pieces !== undefined ? line.pieces : 1;
              const grossW = line.grossWeight || line.grqty || '';
              const grossLoss = line.grossWeightOfLoss || line.grlossgain || 0;
              const pureLoss = line.pureWeightOfLoss || line.pulossgain || 0;
              const booked = line.isBooked || line.isbooked || false;
              const direction = (line.fromOrTo || line.fromorto || 'FROM').toUpperCase();

              return {
                docType: line.docType || line.doctype || 'STF',
                processCode: String(pCode),
                jobCode: String(jCode),
                stockCode: String(sCode),
                pieces: qty,
                grossWeight: String(grossW),
                grossWeightOfLoss: grossLoss,
                pureWeightOfLoss: pureLoss,
                isBooked: booked,
                fromOrTo: direction,
                isNew: false // Mark database-persisted rows as not new
              };
            }));
          }
        } else {
          // Initialize a fresh row matching the active screen mode
          setRows([{
            ...DEFAULT_ROW,
            fromOrTo: isReturnMode ? 'TO' : 'FROM',
            processCode: procs.length > 0 ? String(procs[0].code || procs[0].id) : '',
            jobCode: jobs.length > 0 ? String(jobs[0].code || jobs[0].id) : '',
            stockCode: stocks.length > 0 ? String(stocks[0].code || stocks[0].id) : '',
            isNew: true
          }]);
        }
      } catch (err) {
        console.error('Failed to fetch dropdown options or document lines:', err);
      } finally {
        if (isMounted) setOptionsLoading(false);
      }
    }

    fetchLookupsAndDoc();

    return () => { isMounted = false; };
  }, [isOpen, editDocument, mode, isReturnMode]);

  // Add row
  const handleAddRow = () => {
    const firstProc = processOptions.length > 0 ? String(processOptions[0].code || processOptions[0].id) : '';
    const firstJob = jobOptions.length > 0 ? String(jobOptions[0].code || jobOptions[0].id) : '';
    const firstStock = stockOptions.length > 0 ? String(stockOptions[0].code || stockOptions[0].id) : '';

    setRows([
      ...rows,
      { 
        ...DEFAULT_ROW, 
        fromOrTo: isReturnMode ? 'TO' : 'FROM',
        processCode: firstProc, 
        jobCode: firstJob, 
        stockCode: firstStock,
        isNew: true 
      },
    ]);
  };

  // Remove row
  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, idx) => idx !== index));
  };

  // Update row value
  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    
    // If transitioning a dynamic type back to ISSUE, automatically clear loss and booking values
    if (field === 'fromOrTo' && value === 'FROM') {
      updated[index] = { 
        ...updated[index], 
        [field]: value,
        grossWeightOfLoss: 0,
        pureWeightOfLoss: 0,
        isBooked: false
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setRows(updated);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    // Field Validations for Editable Rows only
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const isEditable = r.isNew || (isReturnMode && r.fromOrTo === 'TO') || (!isReturnMode && r.fromOrTo === 'FROM');
      
      if (isEditable) {
        if (!r.processCode) {
          setErrors(`Row #${i + 1}: Please select a Department/Worker Process.`);
          return;
        }
        if (!r.jobCode) {
          setErrors(`Row #${i + 1}: Please select a Job Number.`);
          return;
        }
        if (!r.stockCode) {
          setErrors(`Row #${i + 1}: Please select a Stock Item.`);
          return;
        }
        if (!r.pieces || isNaN(r.pieces) || Number(r.pieces) <= 0) {
          setErrors(`Row #${i + 1}: Pieces must be greater than 0.`);
          return;
        }
        if (!r.grossWeight || isNaN(r.grossWeight) || Number(r.grossWeight) <= 0) {
          setErrors(`Row #${i + 1}: Gross Weight must be greater than 0.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const payload = rows.map(r => {
        const isEditable = r.isNew || (isReturnMode && r.fromOrTo === 'TO') || (!isReturnMode && r.fromOrTo === 'FROM');
        
        // If row is NOT editable, submit it exactly as is to preserve it in the database
        if (!isEditable) {
          return {
            docType: r.docType,
            processCode: Number(r.processCode),
            jobCode: Number(r.jobCode),
            stockCode: String(r.stockCode),
            pieces: Number(r.pieces),
            grossWeight: Number(r.grossWeight),
            fromOrTo: r.fromOrTo,
            grossWeightOfLoss: Number(r.grossWeightOfLoss || 0),
            pureWeightOfLoss: Number(r.pureWeightOfLoss || 0),
            isBooked: Boolean(r.isBooked)
          };
        }

        const selectedStock = stockOptions.find(o => String(o.code || o.id) === String(r.stockCode));
        const purityValue = selectedStock ? Number(selectedStock.purity || 1.0) : 1.0;
        
        // Enforce zero loss calculations on all ISSUE records
        const isRowReturn = r.fromOrTo === 'TO';
        const grossLossVal = isRowReturn ? Number(r.grossWeightOfLoss || 0) : 0;
        const pureLossVal = Number((grossLossVal * purityValue).toFixed(4));

        return {
          docType: 'STF',
          processCode: Number(r.processCode),
          jobCode: Number(r.jobCode),
          stockCode: String(r.stockCode),
          pieces: Number(r.pieces),
          grossWeight: Number(r.grossWeight),
          fromOrTo: r.fromOrTo,
          grossWeightOfLoss: grossLossVal,
          pureWeightOfLoss: pureLossVal,
          isBooked: isRowReturn ? Boolean(r.isBooked) : false,
        };
      });

      if (editDocument) {
        await stockTransferApi.updateTransfer(editDocument.docNo, payload);
      } else {
        await stockTransferApi.createTransfer(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit transfer document:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/40">
          <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isReturnMode ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {modalTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {errors && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors}</span>
            </div>
          )}

          {optionsLoading ? (
            <div className="p-12 text-center text-amber-500 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-zinc-400">Loading master options and records...</p>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
                <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-3 py-3">#</th>
                    <th className="px-3 py-3 w-32">Type</th>
                    <th className="px-3 py-3">Process / Department</th>
                    <th className="px-3 py-3">Job Number</th>
                    <th className="px-3 py-3">Stock Item</th>
                    <th className="px-3 py-3 w-20">Pieces</th>
                    <th className="px-3 py-3 w-28">Gross Wt (g)</th>
                    <th className="px-3 py-3 w-28 text-rose-500">Loss (g)</th>
                    <th className="px-3 py-3 w-16 text-center">Book</th>
                    <th className="px-3 py-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {rows.map((row, idx) => {
                    const isRowEditable = row.isNew || (isReturnMode && row.fromOrTo === 'TO') || (!isReturnMode && row.fromOrTo === 'FROM');
                    const isRowReturn = row.fromOrTo === 'TO';
                    
                    return (
                      <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${!isRowEditable ? 'bg-slate-50/50 dark:bg-zinc-950/20 opacity-80' : ''}`}>
                        <td className="px-3 py-3 font-bold font-mono text-slate-400">{idx + 1}</td>
                        
                        {/* Type Column */}
                        <td className="px-3 py-3">
                          {row.isNew ? (
                            <select
                              value={row.fromOrTo}
                              onChange={(e) => handleRowChange(idx, 'fromOrTo', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded text-[11px] font-bold text-slate-900 dark:text-zinc-100 focus:outline-none"
                            >
                              <option value="FROM">ISSUE</option>
                              <option value="TO">RETURN</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isRowReturn 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}>
                              {isRowReturn ? 'RETURN' : 'ISSUE'}
                            </span>
                          )}
                        </td>

                        {/* Department / Process Name */}
                        <td className="px-3 py-3">
                          {isRowEditable ? (
                            <select
                              value={row.processCode}
                              onChange={(e) => handleRowChange(idx, 'processCode', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:border-amber-500 focus:outline-none font-medium"
                            >
                              {processOptions.map((opt) => {
                                const code = opt.code || opt.id;
                                const display = opt.name ? `#${code} - ${opt.name}` : `Process #${code}`;
                                return (
                                  <option key={code} value={code}>
                                    {display}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <span className="font-semibold text-slate-900 dark:text-zinc-200">
                              {(() => {
                                const found = processOptions.find(o => String(o.code || o.id) === String(row.processCode));
                                return found?.name ? `#${row.processCode} - ${found.name}` : `Process #${row.processCode}`;
                              })()}
                            </span>
                          )}
                        </td>

                        {/* Job Number */}
                        <td className="px-3 py-3">
                          {isRowEditable ? (
                            <select
                              value={row.jobCode}
                              onChange={(e) => handleRowChange(idx, 'jobCode', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:border-amber-500 focus:outline-none"
                            >
                              {jobOptions.map((opt) => (
                                <option key={opt.code || opt.id} value={opt.code || opt.id}>
                                  {opt.name || `#${opt.code || opt.id}`}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-mono text-slate-500 dark:text-zinc-400">
                              #{row.jobCode}
                            </span>
                          )}
                        </td>

                        {/* Stock Item */}
                        <td className="px-3 py-3">
                          {isRowEditable ? (
                            <select
                              value={row.stockCode}
                              onChange={(e) => handleRowChange(idx, 'stockCode', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                            >
                              {stockOptions.map((opt) => (
                                <option key={opt.code || opt.id} value={opt.code || opt.id}>
                                  {opt.name || opt.code}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-mono font-bold text-slate-500 dark:text-zinc-400">
                              {row.stockCode}
                            </span>
                          )}
                        </td>

                        {/* Pieces */}
                        <td className="px-3 py-3">
                          {isRowEditable ? (
                            <input
                              type="number"
                              min="1"
                              value={row.pieces}
                              onChange={(e) => handleRowChange(idx, 'pieces', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                            />
                          ) : (
                            <span className="font-mono text-slate-500 dark:text-zinc-400">{row.pieces}</span>
                          )}
                        </td>

                        {/* Gross Weight */}
                        <td className="px-3 py-3">
                          {isRowEditable ? (
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={row.grossWeight}
                              onChange={(e) => handleRowChange(idx, 'grossWeight', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                            />
                          ) : (
                            <span className="font-mono font-semibold text-slate-500 dark:text-zinc-400">{Number(row.grossWeight).toFixed(2)} g</span>
                          )}
                        </td>

                        {/* Return Specific: Loss */}
                        <td className="px-3 py-3">
                          {isRowEditable && isRowReturn ? (
                            <input
                              type="number"
                              step="0.001"
                              placeholder="0.000"
                              value={row.grossWeightOfLoss}
                              onChange={(e) => handleRowChange(idx, 'grossWeightOfLoss', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-rose-500 focus:border-amber-500 focus:outline-none font-mono font-semibold"
                            />
                          ) : (
                            <span className="font-mono font-semibold text-rose-400/80">
                              {Number(row.grossWeightOfLoss || 0).toFixed(3)} g
                            </span>
                          )}
                        </td>

                        {/* Return Specific: IsBooked */}
                        <td className="px-3 py-3 text-center">
                          {isRowEditable && isRowReturn ? (
                            <input
                              type="checkbox"
                              checked={row.isBooked}
                              onChange={(e) => handleRowChange(idx, 'isBooked', e.target.checked)}
                              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                            />
                          ) : (
                            <span className="text-slate-400 font-bold">
                              {row.isBooked ? '✓' : '—'}
                            </span>
                          )}
                        </td>

                        {/* Remove Row Button */}
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            disabled={!isRowEditable || rows.filter(r => (isReturnMode ? r.fromOrTo === 'TO' : r.fromOrTo === 'FROM')).length === 1}
                            className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-35 transition-all"
                            title={isRowEditable ? "Remove Row" : "Opposite mode rows cannot be deleted from this screen"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Row Button */}
          <button
            type="button"
            onClick={handleAddRow}
            disabled={optionsLoading}
            className="px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </button>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-xl text-xs transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || optionsLoading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isReturnMode ? 'Save Return Document' : 'Save Transfer Document'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StockTransferModal;