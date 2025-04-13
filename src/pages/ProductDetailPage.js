import React, { useState } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";

// Dummy product data
const product = {
  id: 1,
  name: "Havuz Kimyasal Bakım Seti",
  description:
    "Yüzme havuzunuz için tam kapsamlı kimyasal bakım seti. Klor tabletleri, pH düzenleyici, yosun önleyici ve su berraklaştırıcı içerir.",
  price: 750,
  originalPrice: 899,
  discount: 17,
  rating: 4.5,
  reviewCount: 28,
  stock: 15,
  sku: "HK-5678",
  features: [
    "Havuz suyunu kristal berraklıkta tutar",
    "Cilt ve göz tahrişini önler",
    "Kolay kullanım ve dozaj talimatları",
    "Tüm havuz boyutları için uygun",
    "6 aylık kullanım için yeterlidir",
  ],
  images: [
    "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  ],
  category: "Havuz Kimyasalları",
};

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Function to render rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-4 text-sm">
          <a href="/" className="text-gray-500 hover:text-blue-600">
            Ana Sayfa
          </a>
          <span className="mx-2 text-gray-500">/</span>
          <a
            href={`/category/${product.category}`}
            className="text-gray-500 hover:text-blue-600"
          >
            {product.category}
          </a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row -mx-4">
          {/* Product Images */}
          <div className="md:w-1/2 px-4 mb-6 md:mb-0">
            <div className="mb-4">
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-96 object-contain border rounded-lg"
              />
            </div>

            <div className="flex -mx-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`px-2 w-1/3 cursor-pointer ${
                    activeImageIndex === index
                      ? "opacity-100 border-2 border-blue-500 rounded-lg"
                      : "opacity-70"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - görsel ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 px-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderRatingStars(product.rating)}
              </div>
              <span className="text-gray-600 text-sm">
                ({product.reviewCount} değerlendirme)
              </span>
            </div>

            <div className="mb-4">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-600 mr-2">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-gray-500 line-through">
                    {product.originalPrice.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="ml-2 bg-red-100 text-red-700 text-sm font-semibold px-2 py-1 rounded">
                    %{product.discount} İndirim
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  {product.price.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-semibold">
                  Stok Durumu:
                </span>
                <span
                  className={`${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} adet stokta`
                    : "Stokta yok"}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-semibold">Ürün Kodu:</span>
                <span className="text-gray-600">{product.sku}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Adet
              </label>
              <div className="flex">
                <button
                  className="bg-gray-200 px-3 py-1 rounded-l"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="w-16 text-center border-t border-b outline-none"
                />
                <button
                  className="bg-gray-200 px-3 py-1 rounded-r"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors mb-4">
              <FaShoppingCart className="mr-2" />
              Sepete Ekle
            </button>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Özellikler</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <FaTruck className="text-blue-500 mb-2" size={24} />
                <span className="text-sm text-center">Ücretsiz Kargo</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <FaUndo className="text-blue-500 mb-2" size={24} />
                <span className="text-sm text-center">14 Gün İade</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <FaShieldAlt className="text-blue-500 mb-2" size={24} />
                <span className="text-sm text-center">Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
