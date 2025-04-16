import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
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

          <div className="bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Ürün Resmi */}
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>

              {/* Ürün Bilgileri */}
              <div className="space-y-4">
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
