import { fetchApi } from "./api";

export const adminApi = {
  deleteProduct: async (productId) => {
    return await fetchApi(`/admin/products/${productId}`, {
      method: "DELETE",
    });
  },

  updateProduct: async (productId, productData) => {
    return await fetchApi(`/admin/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  createProduct: async (productData) => {
    return await fetchApi("/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },
};
