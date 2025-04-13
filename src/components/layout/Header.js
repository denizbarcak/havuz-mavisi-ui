import React, { useState } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaSignOutAlt,
  FaAngleDown,
  FaBoxOpen,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const { user, logout } = useAuth();

  const categories = [
    { name: "Havuz Kimyasalları", path: "/category/chemicals" },
    { name: "Havuz Temizlik Malzemesi", path: "/category/cleaning" },
    { name: "Havuz Yapı Malzemeleri", path: "/category/construction" },
    { name: "Sauna ve Spa", path: "/category/sauna-spa" },
    { name: "Havuz Bahçe Ürünleri", path: "/category/garden" },
    {
      name: "Su Arıtma ve Yumuşatma Sistemleri",
      path: "/category/water-systems",
    },
  ];

  return (
    <header className="bg-blue-500 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-white text-2xl font-bold">
              Havuz Mavisi
            </a>
          </div>

          {/* Search Bar - Added in the middle */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full py-2 pl-4 pr-10 rounded-full bg-white bg-opacity-20 border border-blue-400 focus:outline-none focus:bg-opacity-30 text-white placeholder-blue-100"
              />
              <button className="absolute right-0 top-0 h-full px-4 text-white">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Kullanıcı bilgisi veya giriş butonu - ÖNCE */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-white px-4 py-2 flex items-center"
                >
                  <FaUser className="mr-2" />
                  <span className="mr-1">Profil</span>
                  <FaAngleDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <div className="py-2">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-white px-4 py-2 flex items-center"
              >
                <FaUser className="mr-2" />
                Giriş Yap
              </a>
            )}

            {/* Categories dropdown for desktop - ORTADA */}
            <div className="relative group">
              <button className="text-white px-1 py-2 flex items-center">
                <FaBoxOpen className="mr-2" />
                Ürünler
                <FaAngleDown size={14} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50">
                <div className="py-2">
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={category.path}
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Sepetim - EN SONDA */}
            <a href="/cart" className="text-white px-1 py-2 flex items-center">
              <FaShoppingCart className="mr-2" />
              Sepetim
            </a>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-400">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="w-full py-2 pl-4 pr-10 rounded-full bg-white bg-opacity-20 border border-blue-400 focus:outline-none focus:bg-opacity-30 text-white placeholder-blue-100"
                />
                <button className="absolute right-0 top-0 h-full px-4 text-white">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {/* Kullanıcı adı/giriş - ÖNCE */}
              {user ? (
                <div>
                  <button
                    onClick={() =>
                      setIsMobileUserMenuOpen(!isMobileUserMenuOpen)
                    }
                    className="text-white py-2 px-4 flex items-center justify-between w-full"
                  >
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      <span className="font-medium">Profil</span>
                    </div>
                    <FaAngleDown
                      className={`transform transition-transform duration-200 ${
                        isMobileUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMobileUserMenuOpen && (
                    <button
                      onClick={logout}
                      className="text-white py-2 px-4 pl-10 flex items-center w-full bg-blue-600 bg-opacity-30"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Çıkış Yap
                    </button>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="text-white py-2 px-4 flex items-center"
                >
                  <FaUser className="mr-2" />
                  Giriş Yap
                </a>
              )}

              {/* Ürünler - ORTADA */}
              <div className="mt-4 pt-4 border-t border-blue-400">
                <button
                  onClick={() =>
                    setIsMobileCategoriesOpen(!isMobileCategoriesOpen)
                  }
                  className="text-white py-2 px-4 flex items-center justify-between w-full"
                >
                  <div className="flex items-center">
                    <FaBoxOpen className="mr-2" />
                    <span>Ürünler</span>
                  </div>
                  <FaAngleDown
                    className={`transform transition-transform duration-200 ${
                      isMobileCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileCategoriesOpen && (
                  <div className="bg-blue-600 bg-opacity-30">
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href={category.path}
                        className="text-white py-2 px-4 pl-8 block hover:bg-blue-600"
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sepetim - EN SONDA */}
              <div className="mt-4 pt-4 border-t border-blue-400">
                <a
                  href="/cart"
                  className="text-white py-2 px-4 flex items-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Sepetim
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
