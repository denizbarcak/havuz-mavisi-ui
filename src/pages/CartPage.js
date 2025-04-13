import React from "react";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";

// Dummy cart data
const cartItems = [
  {
    id: 1,
    name: "Klor Tabletleri",
    price: 450,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1562763920-8a9f5295d8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    name: "Jakuzi Filtresi",
    price: 180,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];

const CartPage = () => {
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Alışveriş Sepetim</h1>

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
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center">
                          <button className="bg-gray-200 p-1 rounded-l">
                            <FaMinus className="text-gray-600" size={12} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            readOnly
                            className="w-10 text-center bg-gray-100 outline-none p-1"
                          />
                          <button className="bg-gray-200 p-1 rounded-r">
                            <FaPlus className="text-gray-600" size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {item.price.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="py-4 px-2 text-right font-semibold">
                        {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="py-4 px-2 text-center">
                        <button className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <a
              href="/products"
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
      </div>
    </div>
  );
};

export default CartPage;
