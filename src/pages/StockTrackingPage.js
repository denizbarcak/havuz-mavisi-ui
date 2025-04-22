import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllProducts, getAllSubCategories } from "../services/api";
import { FaEdit, FaPlus, FaMinus, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const StockTrackingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockToAdd, setStockToAdd] = useState(1);
  const [allSubCategories, setAllSubCategories] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  // Kategori adlarını Türkçe olarak göster
  const categoryMap = {
    chemicals: "Havuz Kimyasalları",
    cleaning: "Havuz Temizlik Malzemesi",
    construction: "Havuz Yapı Malzemeleri",
    "sauna-spa": "Sauna ve Spa",
    garden: "Havuz Bahçe Ürünleri",
    "water-systems": "Su Arıtma Sistemleri",
  };

  useEffect(() => {
    // Admin yetkisi kontrolü
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Tüm alt kategorileri getir
        try {
          const subcategories = await getAllSubCategories();
          // Alt kategorileri ID'lerle eşleştiren bir nesne oluştur
          const subcategoryMap = {};
          if (Array.isArray(subcategories)) {
            subcategories.forEach((subcat) => {
              if (subcat.id) {
                subcategoryMap[subcat.id] = subcat.name;
              }
              // MongoDB bazen _id kullanabilir
              if (subcat._id) {
                subcategoryMap[subcat._id] = subcat.name;
              }
            });
          }
          setAllSubCategories(subcategoryMap);
        } catch (err) {
          console.error("Alt kategoriler yüklenirken hata:", err);
        }

        // Tüm ürünleri getir
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Ürünler yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Stok miktarına göre stil uygula
  const getStockStyle = (stock) => {
    if (stock <= 0) return "text-red-600";
    if (stock < 5) return "text-orange-500";
    return "text-green-600";
  };

  // Alt kategori adını göster
  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return "-";
    return allSubCategories[subcategoryId] || subcategoryId;
  };

  // Ürünleri filtrele
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        categoryMap[product.category]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (product.subcategory &&
        (getSubcategoryName(product.subcategory)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Stok arttırma modalını aç
  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockToAdd(1);
    setShowModal(true);
  };

  // Stok ekle
  const handleAddStock = async () => {
    if (!selectedProduct || stockToAdd <= 0) return;

    try {
      // API'ye stok güncelleme isteği gönderilecek (backend entegrasyonu yapılacak)
      // Şimdilik sadece frontend'de güncelliyoruz
      const updatedProducts = products.map((p) => {
        if (p.id === selectedProduct.id) {
          return {
            ...p,
            stock: (p.stock || 0) + stockToAdd,
          };
        }
        return p;
      });

      setProducts(updatedProducts);
      setShowModal(false);
      alert(`${selectedProduct.name} ürününe ${stockToAdd} adet stok eklendi.`);
    } catch (err) {
      alert("Stok güncellenirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-sky-800 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Stok Takibi
      </h1>

      {/* Arama ve Filtreleme */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Ürün adı, kategori veya alt kategori ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Ürün Listesi */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tablo Başlık */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-100 font-semibold text-gray-700 border-b">
          <div className="col-span-1">Görsel</div>
          <div className="col-span-4">Ürün Adı</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-2">Alt Kategori</div>
          <div className="col-span-2">Stok Miktarı</div>
          <div className="col-span-1">İşlem</div>
        </div>

        {/* Ürünler */}
        {filteredProducts.length > 0 ? (
          <>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 border-b hover:bg-gray-50 items-center"
              >
                <div className="col-span-1">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </div>
                <div className="col-span-4 font-medium text-gray-800">
                  {product.name}
                </div>
                <div className="col-span-2 text-gray-600">
                  {categoryMap[product.category] || product.category}
                </div>
                <div className="col-span-2 text-gray-600">
                  {getSubcategoryName(product.subcategory)}
                </div>
                <div
                  className={`col-span-2 font-semibold ${getStockStyle(
                    product.stock
                  )}`}
                >
                  {product.stock || 0} adet
                </div>
                <div className="col-span-1 flex space-x-2">
                  <Link
                    to={`/admin/edit-product/${product.id}`}
                    className="p-2 rounded-full hover:bg-gray-200 text-sky-700"
                    title="Düzenle"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => openStockModal(product)}
                    className="p-2 rounded-full hover:bg-gray-200 text-green-600"
                    title="Stok Ekle"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Arama kriterlerinize uygun ürün bulunamadı.
          </div>
        )}
      </div>

      {/* Toplam Ürün Sayısı Bilgisi */}
      <div className="mt-4 text-gray-600">
        Toplam {products.length} ürün | {filteredProducts.length} ürün
        gösteriliyor
      </div>

      {/* Stok Ekleme Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Stok Ekle</h2>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">{selectedProduct.name}</span>{" "}
              ürününe kaç adet stok eklemek istiyorsunuz?
            </p>

            <div className="flex items-center mb-6">
              <div className="border border-gray-300 rounded-lg flex items-center">
                <button
                  onClick={() => setStockToAdd((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 text-sky-700 hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-0 focus:outline-none"
                />
                <button
                  onClick={() => setStockToAdd((prev) => prev + 1)}
                  className="px-4 py-2 text-sky-700 hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                İptal
              </button>
              <button
                onClick={handleAddStock}
                className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTrackingPage;
