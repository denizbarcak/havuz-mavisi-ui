import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaShoppingCart, FaCheck, FaMinus, FaHeart } from "react-icons/fa";
import {
  getProductById,
  addToCart,
  deleteCartItem,
  getCart,
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [cartItemId, setCartItemId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Ürün yüklenirken bir hata oluştu");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && id) {
        try {
          const response = await checkIsFavorite(id);
          setIsFavorite(response.is_favorite);
          if (response.is_favorite) {
            setFavoriteId(response.favorite_id);
          }
        } catch (error) {
          console.error("Favori durumu kontrol edilirken hata:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Ürün bulunamadı"}</p>
        </div>
      </div>
    );
  }

  const toggleFavorite = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await removeFromFavorites(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await addToFavorites(id);
        setIsFavorite(true);
        if (response.favorite && response.favorite.id) {
          setFavoriteId(response.favorite.id);
        }
      }
    } catch (error) {
      console.error("Favori işlemi sırasında hata:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm">
            <a href="/" className="text-gray-500 hover:text-sky-800">
              Ana Sayfa
            </a>
            <span className="mx-2 text-gray-500">/</span>
            <a
              href={`/category/${product.category}`}
              className="text-gray-500 hover:text-sky-800"
            >
              {product.category}
            </a>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image */}
              <div className="md:w-1/2 relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto md:h-full object-cover"
                />

                {/* Favori butonu - Üst sağ köşede */}
                {user && (
                  <button
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-colors shadow-md ${
                      favoriteLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : isFavorite
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-500 hover:text-red-500"
                    }`}
                    aria-label={
                      isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"
                    }
                  >
                    <FaHeart size={20} />
                  </button>
                )}
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 p-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-gray-600">{product.description}</p>

                <div className="mt-6">
                  <p className="text-3xl font-bold text-sky-800">
                    {product.price.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-gray-600">
                    Stok Durumu:{" "}
                    <span className="font-semibold">
                      {product.stock > 0 ? "Stokta var" : "Stokta yok"}
                    </span>
                  </p>
                </div>

                <button
                  className="mt-6 w-full bg-sky-800 text-white px-6 py-3 rounded-md hover:bg-sky-900 transition-colors disabled:bg-sky-300"
                  disabled={product.stock <= 0}
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
