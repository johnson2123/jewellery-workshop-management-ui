import apiClient from './apiClient';

/**
 * Stock Transfer & Return API Service
 */
export const stockTransferApi = {
  /**
   * Get all stock transfers/returns
   * GET /api/v1/StockTransfer
   */
  getAllTransfers: async () => {
    return await apiClient.get('/StockTransfer');
  },

  /**
   * Get transfer lines by Document Number
   * GET /api/v1/StockTransfer/{docNo}
   * @param {number} docNo
   */
  getByDocNo: async (docNo) => {
    return await apiClient.get(`/StockTransfer/${docNo}`);
  },

  /**
   * Create a new transfer document with multiple line items
   * POST /api/v1/StockTransfer
   * @param {Array<Object>} requests - Array of StockTransferRequest items
   */
  createTransfer: async (requests) => {
    return await apiClient.post('/StockTransfer', requests, {
      successToast: 'Stock document created successfully.',
    });
  },

  /**
   * Update an existing transfer document
   * PUT /api/v1/StockTransfer/{docNo}
   * @param {number} docNo
   * @param {Array<Object>} requests - Array of StockTransferRequest items
   */
  updateTransfer: async (docNo, requests) => {
    return await apiClient.put(`/StockTransfer/${docNo}`, requests, {
      successToast: `Stock document #${docNo} updated successfully.`,
    });
  },

  /**
   * Delete an entire transfer document
   * DELETE /api/v1/StockTransfer/{docNo}
   * @param {number} docNo
   */
  deleteTransfer: async (docNo) => {
    return await apiClient.delete(`/StockTransfer/${docNo}`, {
      successToast: `Stock document #${docNo} deleted successfully.`,
    });
  },

  // --- Master Form Dropdown Lookups ---

  /**
   * Get Process / Department Lookup options
   * GET /api/v1/StockTransfer/process-options
   */
  getProcessOptions: async () => {
    return await apiClient.get('/StockTransfer/process-options');
  },

  /**
   * Get Job Number Lookup options
   * GET /api/v1/StockTransfer/job-options
   */
  getJobOptions: async () => {
    return await apiClient.get('/StockTransfer/job-options');
  },

  /**
   * Get Stock Item Lookup options
   * GET /api/v1/StockTransfer/stock-options
   */
  getStockOptions: async () => {
    return await apiClient.get('/StockTransfer/stock-options');
  },
};

export default stockTransferApi;