import apiClient from './apiClient';

/**
 * Item / Metal Management API Service
 */
export const itemApi = {
  /**
   * Get all items/metals
   * GET /api/v1/ItemManagement
   */
  getAllItems: async () => {
    return await apiClient.get('/ItemManagement');
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