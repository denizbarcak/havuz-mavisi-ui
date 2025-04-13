import React, { useState } from "react";
import ProductCard from "../components/product/ProductCard";
import { FaFilter, FaTimes, FaSort, FaCaretDown } from "react-icons/fa";

// Dummy product data for a category
const products = [
  {
    id: 1,
    name: "Klor Tabletleri",
    description: "Havuzunuz için uzun ömürlü klor tabletleri, 5kg paket",
    price: 450,
    originalPrice: 550,
    discount: 18,
    image:
      "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    name: "Havuz Süpürgesi",
    description: "Otomatik havuz temizleyici, tüm yüzeyler için uygun",
    price: 1200,
    originalPrice: 1200,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    name: "Jakuzi Filtresi",
    description: "Yüksek performanslı jakuzi filtresi, kolay kurulum",
    price: 180,
    originalPrice: 220,
    discount: 18,
    image:
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    name: "Havuz Isıtıcı",
    description: "Elektrikli havuz ısıtıcı, enerji tasarruflu model",
    price: 3500,
    originalPrice: 4000,
    discount: 12,
    image:
      "https://images.unsplash.com/photo-1598302936625-6075fbd98996?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    name: "pH Ayarlayıcı",
    description: "Havuz suyunun pH dengesini sağlar, 2L",
    price: 120,
    originalPrice: 150,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    name: "Yosun Önleyici",
    description: "Yosun oluşumunu engelleyen etkili formül, 1L",
    price: 95,
    originalPrice: 110,
    discount: 14,
    image:
      "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 7,
    name: "Su Berraklaştırıcı",
    description: "Bulanık suyu kristal berraklığa kavuşturur, 500ml",
    price: 75,
    originalPrice: 75,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 8,
    name: "Havuz Test Kiti",
    description: "Havuz suyunun kimyasal değerlerini ölçmek için tam kit",
    price: 240,
    originalPrice: 280,
    discount: 14,
    image:
      "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];

// Categories for the breadcrumb
const categories = {
  chemicals: {
    name: "Havuz Kimyasalları",
    breadcrumb: "Havuz Kimyasalları",
  },
  cleaning: {
    name: "Havuz Temizlik Malzemesi",
    breadcrumb: "Havuz Temizlik Malzemesi",
  },
  construction: {
    name: "Havuz Yapı Malzemeleri",
    breadcrumb: "Havuz Yapı Malzemeleri",
  },
  "sauna-spa": {
    name: "Sauna ve Spa",
    breadcrumb: "Sauna ve Spa",
  },
  garden: {
    name: "Havuz Bahçe Ürünleri",
    breadcrumb: "Havuz Bahçe Ürünleri",
  },
  "water-systems": {
    name: "Su Arıtma Sistemleri",
    breadcrumb: "Su Arıtma ve Yumuşatma Sistemleri",
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

  // Get the current category
  const category = categories[categoryId] || categories.chemicals;

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
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full p-2 border rounded-md mr-2"
                    placeholder="Min"
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
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

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Filtrele
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
              <p className="text-gray-600">{products.length} ürün bulundu</p>

              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-gray-600">
                  Sırala:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border rounded-md py-2 pl-3 pr-8"
                  >
                    <option value="featured">Öne Çıkanlar</option>
                    <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                    <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                    <option value="name">İsim (A-Z)</option>
                    <option value="discount">İndirim Oranı</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaSort className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="block"
                >
                  <ProductCard product={product} />
                </a>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-50"
                >
                  Önceki
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-blue-500 text-white border border-blue-500 hover:bg-blue-600"
                >
                  1
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50"
                >
                  3
                </a>
                <a
                  href="#"
                  className="py-2 px-4 bg-white border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50"
                >
                  Sonraki
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
