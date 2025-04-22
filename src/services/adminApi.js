import { fetchApi } from "./api";

export const adminApi = {
  deleteProduct: async (productId) => {
    const formattedId = String(productId).trim();
    if (!formattedId) {
      throw new Error("Geçersiz ürün ID");
    }

    return await fetchApi(`/admin/products/${formattedId}`, {
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
