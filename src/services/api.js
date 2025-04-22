const API_URL = "/api";

// Kategori anahtarlarını MongoDB'deki kategori isimlerine dönüştür
const categoryMap = {
  chemicals: "chemicals",
  cleaning: "cleaning",
  construction: "construction",
  "sauna-spa": "sauna-spa",
  garden: "garden",
  "water-systems": "water-systems",
};

// Yardımcı fetch fonksiyonu
export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Token varsa Authorization header'ını ekle
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Bir hata oluştu");
  }

  return data;
};

// Tüm ürünleri getir
export const getAllProducts = async () => {
  return await fetchApi("/products");
};

// Kategori bazında ürünleri getir
export const getProductsByCategory = async (category, subcategory = null) => {
  // Kategori anahtarını MongoDB'deki gerçek kategori adına dönüştür
  const categoryName = categoryMap[category] || category;

  let url = `/products?category=${encodeURIComponent(categoryName)}`;

  // Alt kategori varsa ekle
  if (subcategory) {
    url += `&subcategory=${encodeURIComponent(subcategory)}`;
  }

  // Backend'de kategori bazlı filtreleme endpoint'i kullan
  return await fetchApi(url);
};

// Ürün detayını getir
export const getProductById = async (id) => {
  return await fetchApi(`/products/${id}`);
};

// Sepete ürün ekle
export const addToCart = async (product_id, quantity = 1) => {
  return await fetchApi("/cart/add", {
    method: "POST",
    body: JSON.stringify({ product_id, quantity }),
  });
};

// Sepeti getir (ürün detaylarıyla birlikte)
export const getCart = async () => {
  return await fetchApi("/cart");
};

// Sepeti ürün detaylarıyla getir - cart endpoint'i zaten ürün detaylarını getirdiği için aynı
export const getCartItems = async () => {
  return await fetchApi("/cart");
};

// Sepet öğesini güncelle
export const updateCartItem = async (itemId, quantity) => {
  return await fetchApi(`/cart/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
};

// Sepetten öğe sil
export const deleteCartItem = async (itemId) => {
  return await fetchApi(`/cart/${itemId}`, {
    method: "DELETE",
  });
};

// Sepet toplamını getir
export const getCartTotal = async () => {
  return await fetchApi("/cart/total");
};

// Sepeti temizle
export const clearCart = async () => {
  return await fetchApi("/cart", {
    method: "DELETE",
  });
};

// Öne çıkan (rastgele) ürünleri getir
export const getFeaturedProducts = async (limit = 4) => {
  const products = await fetchApi("/products");
  // Ürünleri karıştır ve istenen sayıda ürün döndür
  return products.sort(() => Math.random() - 0.5).slice(0, limit);
};

// Ürün ekleme
export const createProduct = async (productData) => {
  return await fetchApi("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

// FAVORI IŞLEMLERI
// Favori ürün ekleme
export const addToFavorites = async (product_id) => {
  return await fetchApi("/favorites", {
    method: "POST",
    body: JSON.stringify({ product_id }),
  });
};

// Favori ürünleri getir
export const getFavorites = async () => {
  return await fetchApi("/favorites/products");
};

// Favori ürünü sil
export const removeFromFavorites = async (favoriteId) => {
  return await fetchApi(`/favorites/${favoriteId}`, {
    method: "DELETE",
  });
};

// Bir ürünün favori olup olmadığını kontrol et
export const checkIsFavorite = async (productId) => {
  return await fetchApi(`/favorites/check/${productId}`);
};

// Alt kategorileri getir
export const getSubCategories = async () => {
  return await fetchApi(`/subcategories`);
};

// Belirli bir kategoriye ait alt kategorileri getir
export const getSubCategoriesByParent = async (category) => {
  const categoryName = categoryMap[category] || category;
  return await fetchApi(
    `/categories/${encodeURIComponent(categoryName)}/subcategories`
  );
};

// Tüm alt kategorileri getir
export const getAllSubCategories = async () => {
  return await fetchApi(`/subcategories`);
};

// Yeni alt kategori ekle (admin için)
export const addSubCategory = async (data) => {
  return await fetchApi(`/subcategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// Alt kategori sil (admin için)
export const deleteSubCategory = async (id) => {
  return await fetchApi(`/subcategories/${id}`, {
    method: "DELETE",
  });
};
