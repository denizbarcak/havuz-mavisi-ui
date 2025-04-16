import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaTrash,
  FaPen,
} from "react-icons/fa";
import { addToCart, getCart, deleteCartItem } from "../../services/api";
import { adminApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

// Basit bir gri placeholder image (base64)
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMxZTQwYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZXNpbSBCdWx1bmFtYWTEsTwvdGV4dD48L3N2Zz4=";

const ProductCard = ({ product, isPreview = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cartItemIds, setCartItemIds] = useState([]); // Ürüne ait sepet ID'lerini sakla
  const { user, logout } = useAuth();

  // Ürün ID'sini doğru şekilde al
  const productId = product.id || product._id; // Backend'den gelen ID formatına göre

  // Normal kullanıcılar için sepet işlemleri
  useEffect(() => {
    if (user && user.role !== "admin") {
      const checkCartStatus = async () => {
        try {
          const cartItems = await getCart();
          let totalQuantity = 0;
          const matchingItemIds = [];

          // Sepet boş değilse ve array ise işlem yap
          if (cartItems && Array.isArray(cartItems)) {
            cartItems.forEach((item) => {
              if (
                item.product_id === productId ||
                (item.product && item.product.id === productId) ||
                (item.product && item.product._id === productId)
              ) {
                totalQuantity += item.quantity;
                matchingItemIds.push(item._id || item.id);
              }
            });

            if (totalQuantity > 0) {
              setQuantity(totalQuantity);
              setCartItemIds(matchingItemIds);
              setAdded(true);
            }
          } else {
            // Sepet boşsa veya geçersizse varsayılan değerleri ayarla
            setQuantity(0);
            setCartItemIds([]);
            setAdded(false);
          }
        } catch (error) {
          console.error("Sepet durumu kontrol edilirken hata:", error);
          // Hata durumunda varsayılan değerleri ayarla
          setQuantity(0);
          setCartItemIds([]);
          setAdded(false);
        }
      };

      checkCartStatus();
    }
  }, [user, productId]);

  // Tüm sayfadaki ürün kartlarının sepet durumunu güncelleyen olay dinleyicisi ekle
  useEffect(() => {
    // Özel olay "cart-updated" için dinleyici
    const handleCartUpdate = () => {
      if (user) {
        const refreshCartStatus = async () => {
          try {
            const cartItems = await getCart();

            // Ürünün sepetteki toplam miktarını hesapla
            let totalQuantity = 0;
            const matchingItemIds = [];

            // Sepet boş değilse ve array ise işlem yap
            if (cartItems && Array.isArray(cartItems)) {
              cartItems.forEach((item) => {
                if (
                  item.product_id === productId ||
                  (item.product && item.product.id === productId) ||
                  (item.product && item.product._id === productId)
                ) {
                  totalQuantity += item.quantity;
                  matchingItemIds.push(item._id || item.id);
                }
              });
            }

            if (totalQuantity > 0) {
              setQuantity(totalQuantity);
              setCartItemIds(matchingItemIds);
              setAdded(true);
            } else {
              setQuantity(0);
              setCartItemIds([]);
              setAdded(false);
            }
          } catch (error) {
            console.error("Sepet durumu güncellenirken hata:", error);
            // Hata durumunda varsayılan değerleri ayarla
            setQuantity(0);
            setCartItemIds([]);
            setAdded(false);
          }
        };

        refreshCartStatus();
      }
    };

    // Olayı dinle
    window.addEventListener("cart-updated", handleCartUpdate);

    // Temizlik fonksiyonu
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [user, productId]);

  // Backend'den gelen verilerle frontend gösterimi arasındaki eşleştirme
  const discount =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  // Ürün resmi için fallback
  const imageUrl = product.image_url || PLACEHOLDER_IMAGE;

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
      const response = await addToCart(productId, 1);
      console.log("Sepete ekleme yanıtı:", response);

      // Miktar sayacını arttır
      setQuantity((prev) => prev + 1);
      setAdded(true);

      // Sepet güncellendiğinde tüm ürün kartlarını bilgilendir
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      alert("Ürün sepete eklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.preventDefault(); // Ürün detay sayfasına gitmesini engelle

    if (!cartItemIds.length) {
      return;
    }

    try {
      setIsLoading(true);

      // En son eklenen ürünü sepetten çıkar (son eklenen ID)
      const itemIdToRemove = cartItemIds[cartItemIds.length - 1];
      await deleteCartItem(itemIdToRemove);

      // Miktar sayacını azalt
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        if (newQuantity <= 0) {
          setAdded(false);
          return 0;
        }
        return newQuantity;
      });

      // Sepet ID'lerini güncelle
      setCartItemIds((prev) => prev.filter((id) => id !== itemIdToRemove));

      // Sepet güncellendiğinde tüm ürün kartlarını bilgilendir
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Sepetten çıkarırken hata:", error);
      alert("Ürün sepetten çıkarılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Admin için ürün silme fonksiyonu
  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      console.error("Admin yetkisi gerekli");
      return;
    }

    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      setIsLoading(true);
      await adminApi.deleteProduct(productId);
      window.location.reload();
    } catch (error) {
      if (error.message === "Bu işlem için admin yetkisi gerekli") {
        logout();
        navigate("/login");
      }
      console.error("Ürün silinirken hata:", error);
      alert("Ürün silinirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Admin için düzenleme yönlendirmesi
  const handleEditProduct = (e) => {
    e.preventDefault();
    if (!user || user.role !== "admin") {
      console.error("Admin yetkisi gerekli");
      return;
    }
    navigate(`/admin/edit-product/${productId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <a
        href={isPreview ? "#" : `/product/${product.id}`}
        className={`block relative ${isPreview ? "cursor-default" : ""}`}
        onClick={(e) => isPreview && e.preventDefault()}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            %{discount} İndirim
          </div>
        )}
      </a>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex justify-between items-center">
          <div>
            {discount > 0 ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through text-sm mr-2">
                  {product.originalPrice?.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-sky-800 font-bold">
                  {product.price?.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            ) : (
              <span className="text-sky-800 font-bold">
                {product.price?.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          {isPreview ? (
            // Önizleme için deaktif sepet butonu
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 cursor-default opacity-80"
              aria-label="Sepete Ekle (Önizleme)"
            >
              <FaShoppingCart size={16} className="text-white" />
            </button>
          ) : user?.role === "admin" ? (
            // Admin için düzenleme ve silme butonları
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteProduct}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                aria-label="Ürünü Sil"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaTrash size={12} />
                )}
              </button>
              <button
                onClick={handleEditProduct}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-900 text-white transition-colors"
                aria-label="Ürünü Düzenle"
              >
                <FaPen size={16} />
              </button>
            </div>
          ) : // Normal kullanıcılar için sepet butonu
          added ? (
            <div className="flex items-center relative">
              <button
                className="h-8 px-4 flex items-center justify-start rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 pr-8"
                style={{ width: "90px", paddingRight: "40px" }}
                aria-label="Sepetten Çıkar"
                onClick={handleRemoveFromCart}
                disabled={isLoading}
              >
                <FaMinus size={12} />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-900 text-white absolute right-0"
                aria-label="Sepete Ekle"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="font-bold">{quantity}</span>
                )}
              </button>
            </div>
          ) : (
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-900 text-white"
              aria-label="Sepete Ekle"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaShoppingCart size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
