import apiClient from './apiClient';

/**
 * Item / Metal Management API Service
 */
export const itemApi = {
  /**
   * Get unpaginated items/metals list (for dropdown options and lookups)
   * GET /api/v1/ItemManagement/options
   */
  getAllItems: async () => {
    return await apiClient.get('/ItemManagement/options');
  },

  /**
   * Get paginated items/metals with search and filters
   * GET /api/v1/ItemManagement?pageNumber={page}&pageSize={size}&searchTerm={search}&sortBy={field}&isDescending={bool}
   * @param {Object} params - { pageNumber: number, pageSize: number, searchTerm: string, sortBy: string, isDescending: boolean }
   */
  getPagedItems: async (params) => {
    return await apiClient.get('/ItemManagement', { params });
  },

  /**
   * Get single item by code
   * GET /api/v1/ItemManagement/{itemCode}
   * @param {string} itemCode
   */
  getItemByCode: async (itemCode) => {
    return await apiClient.get(`/ItemManagement/${encodeURIComponent(itemCode)}`);
  },

  /**
   * Create a new item/metal
   * POST /api/v1/ItemManagement
   * @param {Object} data - { itemCode: string, itemName: string, purity: number }
   */
  createItem: async (data) => {
    return await apiClient.post('/ItemManagement', data, {
      successToast: 'Metal item created successfully.',
    });
  },

  /**
   * Update an existing item/metal
   * PUT /api/v1/ItemManagement/{itemCode}
   * @param {string} itemCode - Item Code
   * @param {Object} data - { itemCode: string, itemName: string, purity: number }
   */
  updateItem: async (itemCode, data) => {
    return await apiClient.put(`/ItemManagement/${encodeURIComponent(itemCode)}`, data, {
      successToast: 'Metal item updated successfully.',
    });
  },

  /**
   * Delete an item/metal
   * DELETE /api/v1/ItemManagement/{itemCode}
   * @param {string} itemCode - Item Code
   */
  deleteItem: async (itemCode) => {
    return await apiClient.delete(`/ItemManagement/${encodeURIComponent(itemCode)}`, {
      successToast: 'Metal item deleted successfully.',
    });
  },
};

export default itemApi;