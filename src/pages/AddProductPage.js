import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/product/ProductCard";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    stock: "",
  });

  // Kategoriler
  const categories = [
    { key: "chemicals", name: "Havuz Kimyasalları" },
    { key: "cleaning", name: "Havuz Temizlik Malzemesi" },
    { key: "construction", name: "Havuz Yapı Malzemeleri" },
    { key: "sauna-spa", name: "Sauna ve Spa" },
    { key: "garden", name: "Havuz Bahçe Ürünleri" },
    { key: "water-systems", name: "Su Arıtma Sistemleri" },
  ];

  // Form validation
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Ürün adı gereklidir";
    if (!formData.description.trim())
      newErrors.description = "Açıklama gereklidir";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Geçerli bir fiyat giriniz";
    if (!formData.category) newErrors.category = "Kategori seçiniz";
    if (!formData.image_url.trim())
      newErrors.image_url = "Resim URL'si gereklidir";
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0)
      newErrors.stock = "Geçerli bir stok miktarı giriniz";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Admin kontrolü
    if (!user || user.role !== "admin") {
      setError("Bu sayfaya erişim yetkiniz yok");
      navigate("/");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) {
        throw new Error("Ürün eklenirken bir hata oluştu");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Preview için ürün verisi oluştur
  const previewProduct = {
    id: "preview",
    name: formData.name || "Ürün Adı",
    description: formData.description || "Ürün açıklaması burada görünecek",
    price: formData.price ? parseFloat(formData.price) : 0,
    image_url:
      formData.image_url ||
      "https://via.placeholder.com/300x200?text=Ürün+Resmi+Yok",
    category: formData.category || "",
    stock: formData.stock ? parseInt(formData.stock) : 0,
  };

  // Admin değilse ana sayfaya yönlendir
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
              {/* Form Bölümü */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Ürün Adı */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Ürün Adı
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="off"
                      className={`w-full p-2 border rounded-md ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Açıklama
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full p-2 border rounded-md ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Fiyat */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full p-2 border rounded-md ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Resim URL */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Resim URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      autoComplete="off"
                      className={`w-full p-2 border rounded-md ${
                        errors.image_url ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.image_url && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.image_url}
                      </p>
                    )}
                  </div>

                  {/* Stok */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Stok Miktarı
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`w-full p-2 border rounded-md ${
                        errors.stock ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-sky-800 text-white px-6 py-2 rounded-md hover:bg-sky-900 transition-colors disabled:bg-sky-300"
                    >
                      {loading ? "Ekleniyor..." : "Ürün Ekle"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Önizleme Bölümü */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Ürün Önizleme</h2>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="w-[280px]">
                    <ProductCard product={previewProduct} isPreview={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProductPage;
