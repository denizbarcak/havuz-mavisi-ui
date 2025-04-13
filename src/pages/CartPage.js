import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { getCart, updateCartItem, deleteCartItem } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Sayfa yüklendiğinde sepeti getir
  useEffect(() => {
    // Kullanıcı giriş yapmamışsa sepeti getirme
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        console.log("Sepet verisi:", data);
        setCartItems(data || []);
      } catch (err) {
        console.error("Sepet yüklenirken hata:", err);
        setError("Sepetiniz yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Sepetteki ürün miktarını güncelle
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(itemId, newQuantity);
      // Sepeti güncelleme (UI'ı güncelle)
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Miktar güncellenirken hata:", error);
      alert("Ürün miktarı güncellenemedi");
    }
  };

  // Sepetten ürün sil
  const handleRemoveItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      // UI'dan ürünü kaldır
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error("Ürün silinirken hata:", error);
      alert("Ürün sepetten silinemedi");
    }
  };

  // Ürün fiyatlarının toplamını hesapla
  const subtotal = cartItems.reduce((total, item) => {
    // Ürün bilgisi varsa (product alanı varsa veya product dizisi doluysa)
    let productPrice = 0;
    if (item.product) {
      // Tek bir ürün objesi olarak geldiyse (lookupStage + unwindStage durumu)
      productPrice = item.product.price;
    } else if (Array.isArray(item.product) && item.product.length > 0) {
      // Ürün dizisi olarak geldiyse
      productPrice = item.product[0].price;
    } else {
      // Backend'den sadece ürün ID'si almış olabiliriz
      console.log("Ürün bilgisi yok, sadece ID:", item.product_id);
    }

    return total + productPrice * item.quantity;
  }, 0);

  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Alışveriş Sepetim</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <p className="text-center py-8">
              Sepetinizi görmek için lütfen{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                giriş yapın
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Alışveriş Sepetim</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <p className="text-center py-8">
              Sepetinizde ürün bulunmamaktadır.
            </p>
            <div className="text-center">
              <a
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                Alışverişe Başla
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart items */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-2">Ürün</th>
                      <th className="text-center py-4 px-2">Adet</th>
                      <th className="text-right py-4 px-2">Fiyat</th>
                      <th className="text-right py-4 px-2">Toplam</th>
                      <th className="text-right py-4 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      // Ürün bilgisini al - GetCartItems API'den gelen yapı formatına göre
                      let productName = "Ürün bilgisi yüklenemedi";
                      let productPrice = 0;
                      let productImage =
                        "https://via.placeholder.com/300x200?text=Ürün+Resmi+Yok";

                      if (item.product) {
                        // GetCartItems fonksiyonu aggregation ile ürün bilgisini getiriyor
                        productName = item.product.name;
                        productPrice = item.product.price;
                        productImage = item.product.image_url || productImage;
                      } else if (
                        Array.isArray(item.product) &&
                        item.product.length > 0
                      ) {
                        // Farklı bir API formatı olabilir - dizi olarak gelmiş olabilir
                        productName = item.product[0].name;
                        productPrice = item.product[0].price;
                        productImage =
                          item.product[0].image_url || productImage;
                      } else {
                        // Sadece product_id var, ürün bilgisi yok
                        productName = `Ürün ID: ${item.product_id}`;
                      }

                      return (
                        <tr key={item._id || item.id} className="border-b">
                          <td className="py-4 px-2">
                            <div className="flex items-center">
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                              <span className="font-semibold">
                                {productName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-center">
                              <button
                                className="bg-gray-200 p-1 rounded-l"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id || item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <FaMinus className="text-gray-600" size={12} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                readOnly
                                className="w-10 text-center bg-gray-100 outline-none p-1"
                              />
                              <button
                                className="bg-gray-200 p-1 rounded-r"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id || item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <FaPlus className="text-gray-600" size={12} />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right">
                            {productPrice.toLocaleString("tr-TR")} ₺
                          </td>
                          <td className="py-4 px-2 text-right font-semibold">
                            {(productPrice * item.quantity).toLocaleString(
                              "tr-TR"
                            )}{" "}
                            ₺
                          </td>
                          <td className="py-4 px-2 text-center">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRemoveItem(item._id || item.id)
                              }
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <a
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                Alışverişe Devam Et
              </a>
            </div>

            {/* Order summary */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-semibold">
                    {shipping.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold">Toplam</span>
                  <span className="text-lg font-bold text-blue-600">
                    {total.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md w-full transition-colors">
                  Ödeme Yap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
