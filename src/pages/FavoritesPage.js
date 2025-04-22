import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFavorites, removeFromFavorites } from "../services/api";
import { FaHeart, FaTimesCircle } from "react-icons/fa";
import ProductCard from "../components/product/ProductCard";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data || []);
        setError(null);
      } catch (err) {
        console.error("Favoriler yüklenirken hata:", err);
        setError("Favoriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFavorites();
    }
  }, [user]);

  const handleRemoveFromFavorites = async (favoriteId) => {
    try {
      await removeFromFavorites(favoriteId);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav._id !== favoriteId)
      );
    } catch (err) {
      console.error("Favori kaldırılırken hata:", err);
      setError("Ürün favorilerden kaldırılamadı. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="w-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="w-full flex justify-center py-10">
            <div className="text-red-600 bg-red-100 p-4 rounded-md">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Favorileri uygun formata dönüştür
  const formattedFavorites = favorites
    .map((favorite) => {
      // Eğer product varsa ve içinde gerekli bilgiler varsa dönüştür
      if (favorite.product) {
        return {
          ...favorite.product,
          id: favorite.product._id, // ProductCard bileşeninin kullanacağı formata çevir
          favoriteId: favorite._id, // Silme işlemi için favori ID'sini sakla
        };
      }
      return null;
    })
    .filter(Boolean); // null olanları filtrele

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-800">Favori Ürünlerim</h1>
          <p className="text-gray-600 mt-2">
            Beğendiğiniz ve daha sonra bakmak istediğiniz ürünler
          </p>
        </div>

        {!formattedFavorites || formattedFavorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Henüz favori ürününüz yok
            </h2>
            <p className="text-gray-600 mb-4">
              Ürünleri keşfedin ve beğendiklerinizi favorilere ekleyin
            </p>
            <Link
              to="/"
              className="inline-block bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formattedFavorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
