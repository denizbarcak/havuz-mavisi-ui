import React, { useState, useEffect } from "react";
import ProductCard from "../components/product/ProductCard";
import { FaFilter, FaTimes, FaSort, FaCaretDown } from "react-icons/fa";
import { getProductsByCategory } from "../services/api";

// Categories for the breadcrumb
const categories = {
  chemicals: {
    name: "Havuz Kimyasalları",
    breadcrumb: "Havuz Kimyasalları",
    key: "chemicals",
  },
  cleaning: {
    name: "Havuz Temizlik Malzemesi",
    breadcrumb: "Havuz Temizlik Malzemesi",
    key: "cleaning",
  },
  construction: {
    name: "Havuz Yapı Malzemeleri",
    breadcrumb: "Havuz Yapı Malzemeleri",
    key: "construction",
  },
  "sauna-spa": {
    name: "Sauna ve Spa",
    breadcrumb: "Sauna ve Spa",
    key: "sauna-spa",
  },
  garden: {
    name: "Havuz Bahçe Ürünleri",
    breadcrumb: "Havuz Bahçe Ürünleri",
    key: "garden",
  },
  "water-systems": {
    name: "Su Arıtma Sistemleri",
    breadcrumb: "Su Arıtma ve Yumuşatma Sistemleri",
    key: "water-systems",
  },
};

const CategoryPage = ({ categoryId = "chemicals" }) => {
  // States for filters and sorting
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    discount: false,
    inStock: false,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the current category
  const category = categories[categoryId] || categories.chemicals;

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(category.key);
        setProducts(data || []); // Eğer data null ise boş dizi kullan
      } catch (err) {
        console.error("Ürünler yüklenirken hata oluştu:", err);
        setError(
          "Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
        setProducts([]); // Hata durumunda boş dizi kullan
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, category.key]);

  // Apply filters and sorting
  const filteredProducts = Array.isArray(products)
    ? products
        .filter((product) => {
          // Apply price filter
          const passesPrice =
            product.price >= priceRange[0] && product.price <= priceRange[1];

          // Apply discount filter if selected
          const passesDiscount = selectedFilters.discount
            ? product.originalPrice && product.price < product.originalPrice
            : true;

          // In a real app, we would check stock here too
          const passesStock = true;

          return passesPrice && passesDiscount && passesStock;
        })
        .sort((a, b) => {
          // Apply sorting
          switch (sortBy) {
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            case "newest":
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case "discount":
              const discountA = a.originalPrice
                ? ((a.originalPrice - a.price) / a.originalPrice) * 100
                : 0;
              const discountB = b.originalPrice
                ? ((b.originalPrice - b.price) / b.originalPrice) * 100
                : 0;
              return discountB - discountA;
            default:
              return 0; // Default/featured sorting
          }
        })
    : [];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm">
          <a href="/" className="text-gray-500 hover:text-blue-600">
            Ana Sayfa
          </a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">{category.breadcrumb}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-between"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <span className="flex items-center">
              <FaFilter className="mr-2" /> Filtreler
            </span>
            <FaCaretDown />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Filters - Sidebar */}
          <div
            className={`lg:w-1/4 lg:pr-8 ${
              isFilterVisible ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filtreler</h2>
                <button
                  className="lg:hidden text-gray-500"
                  onClick={() => setIsFilterVisible(false)}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Fiyat Aralığı</h3>
                <div className="flex items-center mb-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="w-full p-2 border rounded-md mr-2"
                    placeholder="Min"
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) || 0,
                      ])
                    }
                    className="w-full p-2 border rounded-md ml-2"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>

              {/* Other Filters */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Diğer Filtreler</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="discount"
                      checked={selectedFilters.discount}
                      onChange={() =>
                        setSelectedFilters({
                          ...selectedFilters,
                          discount: !selectedFilters.discount,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="discount">İndirimli Ürünler</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={selectedFilters.inStock}
                      onChange={() =>
                        setSelectedFilters({
                          ...selectedFilters,
                          inStock: !selectedFilters.inStock,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="inStock">Stokta Olanlar</label>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                onClick={() => {
                  // Filter uygulandı olarak işaretlenebilir
                }}
              >
                Filtrele
              </button>
            </div>
          </div>

          {/* Products Area */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
              <div className="flex items-center">
                <FaSort className="text-gray-500 mr-2" />
                <span className="text-gray-700">Sırala: </span>
              </div>
              <div>
                <select
                  className="border-none bg-transparent focus:outline-none text-gray-700"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Öne Çıkanlar</option>
                  <option value="price-asc">Fiyat (Artan)</option>
                  <option value="price-desc">Fiyat (Azalan)</option>
                  <option value="newest">En Yeniler</option>
                  <option value="discount">İndirim Oranı</option>
                </select>
              </div>
            </div>

            {/* Product Display */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Bu kategoride ürün bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
