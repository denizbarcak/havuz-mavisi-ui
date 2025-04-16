import React, { useState, useEffect } from "react";
import ProductCard from "../components/product/ProductCard";
import {
  FaArrowRight,
  FaSpinner,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";
import { getFeaturedProducts } from "../services/api";

// Categories data
const categories = [
  {
    id: 1,
    name: "Havuz Kimyasalları",
    image:
      "https://i.pinimg.com/736x/43/33/5c/43335c97ec043b2d9b0fbbdedbeb0e45.jpg",
    path: "/category/chemicals",
  },
  {
    id: 2,
    name: "Havuz Temizlik Malzemesi",
    image:
      "https://i.pinimg.com/736x/64/0d/19/640d197edd1da2ad0a0a79aa4545ba02.jpg",
    path: "/category/cleaning",
  },
  {
    id: 3,
    name: "Havuz Yapı Malzemeleri",
    image:
      "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    path: "/category/construction",
  },
  {
    id: 4,
    name: "Sauna ve Spa",
    image:
      "https://i.pinimg.com/736x/2d/8e/7c/2d8e7cb2f6a2b150596e0d4824e232cc.jpg",
    path: "/category/sauna-spa",
  },
  {
    id: 5,
    name: "Havuz Bahçe Ürünleri",
    image:
      "https://i.pinimg.com/736x/3f/3f/ef/3f3fefb3b320bb99213dfb576968396c.jpg",
    path: "/category/garden",
  },
  {
    id: 6,
    name: "Su Arıtma Sistemleri",
    image:
      "https://i.pinimg.com/736x/59/45/20/594520c7db3717a2900ec4e3766dbd30.jpg",
    path: "/category/water-systems",
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (err) {
        console.error("Öne çıkan ürünler yüklenirken hata:", err);
        setError("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-sky-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-800 to-sky-900 opacity-90"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('/images/F098E505-0215-4F96-AAFE-7EE1F8116CC7.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Havuz ve Su Sistemleri Uzmanınız
            </h1>
            <p className="text-xl mb-8">
              Kaliteli ürünler, uygun fiyatlar ve uzman desteğiyle havuz, sauna
              ve su arıtma çözümleri
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <button className="bg-white text-sky-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto text-center">
                Ürünleri Keşfet
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-sky-800 transition-colors w-full sm:w-auto text-center">
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ürün Kategorilerimiz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <a key={category.id} href={category.path} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 bg-sky-800 text-white">
                    <h3 className="font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
            <a
              href="/products"
              className="text-sky-800 hover:text-sky-900 flex items-center"
            >
              Tüm ürünleri gör <FaArrowRight className="ml-2" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-sky-800 text-4xl" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Neden Bizi Tercih Etmelisiniz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="w-8 h-8 text-sky-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Kaliteli Ürünler</h3>
              <p className="text-gray-600">
                Sadece en kaliteli ve dayanıklı havuz ekipmanlarını sunuyoruz.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="w-8 h-8 text-sky-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hızlı Teslimat</h3>
              <p className="text-gray-600">
                Siparişleriniz en kısa sürede hazırlanır ve güvenli şekilde
                teslim edilir.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="w-8 h-8 text-sky-800" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Teknik Destek</h3>
              <p className="text-gray-600">
                Uzman ekibimiz kurulum ve kullanım konularında 7/24 yardımcı
                olur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-sky-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bültenimize Abone Olun</h2>
            <p className="mb-8">
              Yeni ürünler, indirimler ve havuz bakımı hakkında ipuçları almak
              için kaydolun.
            </p>

            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-sky-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
