import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Havuz Mavisi</h3>
            <p className="text-gray-300 mb-4">
              Tüm havuz, sauna ve su arıtma ihtiyaçlarınız için güvenilir
              alışveriş sitesi.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-white">
                  Ürünler
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white">
                  İletişim
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white">
                  Sıkça Sorulan Sorular
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/category/chemicals"
                  className="text-gray-300 hover:text-white"
                >
                  Havuz Kimyasalları
                </a>
              </li>
              <li>
                <a
                  href="/category/cleaning"
                  className="text-gray-300 hover:text-white"
                >
                  Havuz Temizlik Malzemesi
                </a>
              </li>
              <li>
                <a
                  href="/category/construction"
                  className="text-gray-300 hover:text-white"
                >
                  Havuz Yapı Malzemeleri
                </a>
              </li>
              <li>
                <a
                  href="/category/sauna-spa"
                  className="text-gray-300 hover:text-white"
                >
                  Sauna ve Spa
                </a>
              </li>
              <li>
                <a
                  href="/category/garden"
                  className="text-gray-300 hover:text-white"
                >
                  Havuz Bahçe Ürünleri
                </a>
              </li>
              <li>
                <a
                  href="/category/water-systems"
                  className="text-gray-300 hover:text-white"
                >
                  Su Arıtma Sistemleri
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start justify-center md:justify-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-400" />
                <span className="text-gray-300">
                  Havuz Caddesi No:42, İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaPhone className="mr-3 text-blue-400" />
                <a
                  href="tel:+902121234567"
                  className="text-gray-300 hover:text-white"
                >
                  +90 212 123 45 67
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-3 text-blue-400" />
                <a
                  href="mailto:info@havuzmavisi.com"
                  className="text-gray-300 hover:text-white"
                >
                  info@havuzmavisi.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Havuz Mavisi. Tüm hakları
            saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
