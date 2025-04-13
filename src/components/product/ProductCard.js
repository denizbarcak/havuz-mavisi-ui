import React, { useState } from "react";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { addToCart } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { user } = useAuth();

  // Ürün ID'sini doğru şekilde al
  const productId = product.id || product._id; // Backend'den gelen ID formatına göre

  // Backend'den gelen verilerle frontend gösterimi arasındaki eşleştirme
  const discount =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  // Ürün resmi için fallback
  const imageUrl =
    product.image_url ||
    "https://via.placeholder.com/300x200?text=Ürün+Resmi+Yok";

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Ürün detay sayfasına gitmesini engelle

    if (!user) {
      // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);
      console.log("Ürün ID:", productId); // Debug için ID'yi konsola yazdır

      // API ile sepete ekleme
      await addToCart(productId, 1);
      setAdded(true);

      // Ekleme bildirimini 2 saniye sonra kaldır
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      alert("Ürün sepete eklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <a href={`/product/${productId}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              %{discount} İndirim
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm h-12 overflow-hidden">
            {product.description}
          </p>

          <div className="mt-4 flex justify-between items-center">
            <div>
              {discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-gray-400 line-through text-sm mr-2">
                    {product.originalPrice?.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-blue-600 font-bold">
                    {product.price?.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              ) : (
                <span className="text-blue-600 font-bold">
                  {product.price?.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>

            <button
              className={`p-2 rounded-full ${
                added
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              aria-label="Sepete Ekle"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : added ? (
                <FaCheckCircle size={16} />
              ) : (
                <FaShoppingCart size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
