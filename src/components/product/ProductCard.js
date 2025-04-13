import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            %{product.discount} İndirim
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
            {product.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through text-sm mr-2">
                  {product.originalPrice.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-blue-600 font-bold">
                  {product.price.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            ) : (
              <span className="text-blue-600 font-bold">
                {product.price.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
            aria-label="Sepete Ekle"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
