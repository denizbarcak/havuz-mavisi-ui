import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { addToCart, getCart, deleteCartItem } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cartItemIds, setCartItemIds] = useState([]); // Ürüne ait sepet ID'lerini sakla
  const { user } = useAuth();

  // Ürün ID'sini doğru şekilde al
  const productId = product.id || product._id; // Backend'den gelen ID formatına göre

  // Sayfa yüklendiğinde ürünün sepetteki durumunu kontrol et
  useEffect(() => {
    // Kullanıcı giriş yapmışsa, sepet bilgilerini al
    if (user) {
      const checkCartStatus = async () => {
        try {
          const cartItems = await getCart();

          // Ürünün sepetteki toplam miktarını hesapla
          let totalQuantity = 0;
          const matchingItemIds = [];

          // Aynı ürünün miktarlarını topla
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
        } catch (error) {
          console.error("Sepet durumu kontrol edilirken hata:", error);
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
            } else {
              setQuantity(0);
              setCartItemIds([]);
              setAdded(false);
            }
          } catch (error) {
            console.error("Sepet durumu güncellenirken hata:", error);
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

            {added ? (
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
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white absolute right-0"
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
                className={`w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white`}
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
    </a>
  );
};

export default ProductCard;
