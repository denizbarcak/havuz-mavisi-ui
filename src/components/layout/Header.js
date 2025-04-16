import React, { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaSignOutAlt,
  FaAngleDown,
  FaBoxOpen,
  FaCaretDown,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getCart, getAllProducts } from "../../services/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const { user, logout } = useAuth();

  // Refs for dropdown menus
  const userMenuRef = useRef(null);
  const productsMenuRef = useRef(null);
  const adminMenuRef = useRef(null);

  // Timeout refs for closing menus
  const userMenuTimeoutRef = useRef(null);
  const productsMenuTimeoutRef = useRef(null);
  const adminMenuTimeoutRef = useRef(null);

  // Tüm ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      }
    };
    fetchProducts();
  }, []);

  // Arama işlemi
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().split(" ");
      const results = allProducts.filter((product) => {
        const productWords = product.name.toLowerCase().split(" ");
        // Her arama kelimesi için kontrol et
        return searchWords.every((searchWord) =>
          // Ürün adındaki herhangi bir kelimenin başlangıcı arama kelimesiyle eşleşiyor mu?
          productWords.some((word) => word.startsWith(searchWord))
        );
      });
      setSearchResults(results.slice(0, 5)); // En fazla 5 sonuç göster
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, allProducts]);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sepetteki ürün sayısını takip et
  useEffect(() => {
    if (user) {
      const fetchCartCount = async () => {
        try {
          const cartItems = await getCart();
          if (cartItems && cartItems.length) {
            const totalItems = cartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            setCartItemCount(totalItems);
          } else {
            setCartItemCount(0);
          }
        } catch (error) {
          console.error("Sepet sayısı alınırken hata:", error);
        }
      };

      fetchCartCount();

      // Sepet güncellendiğinde sayıyı yenile
      const handleCartUpdate = () => {
        fetchCartCount();
      };

      window.addEventListener("cart-updated", handleCartUpdate);
      return () => {
        window.removeEventListener("cart-updated", handleCartUpdate);
      };
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  // Handle mouse enter for dropdown menus
  const handleMouseEnter = (setter, timeoutRef) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setter(true);
  };

  // Handle mouse leave for dropdown menus
  const handleMouseLeave = (setter, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      setter(false);
    }, 200); // 200ms delay before closing
  };

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
    <header className="bg-sky-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-white text-2xl font-bold">
              Havuz Mavisi
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <div className="relative w-full max-w-xl" ref={searchRef}>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
                className="w-full py-2 pl-4 pr-10 rounded-full bg-white bg-opacity-20 border border-sky-400 focus:outline-none focus:bg-opacity-30 text-white placeholder-sky-100"
              />
              <button className="absolute right-0 top-0 h-full px-4 text-white">
                <FaSearch />
              </button>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-sky-800 rounded-lg shadow-lg overflow-hidden z-50">
                  {searchResults.map((product) => (
                    <a
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="block px-4 py-2 hover:bg-sky-700 text-white transition-colors"
                      onClick={() => {
                        setShowResults(false);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex items-center">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-sky-100">
                            {product.price.toLocaleString("tr-TR")} ₺
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
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
          <nav className="hidden md:flex items-center space-x-2">
            {/* Kullanıcı bilgisi veya giriş butonu - ÖNCE */}
            {user ? (
              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={() =>
                  handleMouseEnter(setIsUserMenuOpen, userMenuTimeoutRef)
                }
                onMouseLeave={() =>
                  handleMouseLeave(setIsUserMenuOpen, userMenuTimeoutRef)
                }
              >
                <button className="text-white px-4 py-2 flex items-center">
                  <FaUser className="mr-2" />
                  <span className="mr-1">Profil</span>
                  <FaCaretDown className="ml-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <div className="py-2">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-sky-100"
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
            <div
              className="relative"
              ref={productsMenuRef}
              onMouseEnter={() =>
                handleMouseEnter(
                  setIsMobileCategoriesOpen,
                  productsMenuTimeoutRef
                )
              }
              onMouseLeave={() =>
                handleMouseLeave(
                  setIsMobileCategoriesOpen,
                  productsMenuTimeoutRef
                )
              }
            >
              <button className="text-white px-4 py-2 flex items-center">
                <FaBoxOpen className="mr-2" />
                Ürünler
                <FaCaretDown className="ml-1" />
              </button>
              {isMobileCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-md z-50">
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href={category.path}
                        className="block px-4 py-2 text-gray-800 hover:bg-sky-100"
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sepetim - EN SONDA */}
            {user?.role === "admin" ? (
              <div
                className="relative"
                ref={adminMenuRef}
                onMouseEnter={() =>
                  handleMouseEnter(setIsMobileUserMenuOpen, adminMenuTimeoutRef)
                }
                onMouseLeave={() =>
                  handleMouseLeave(setIsMobileUserMenuOpen, adminMenuTimeoutRef)
                }
              >
                <button className="text-white px-4 py-2 flex items-center">
                  <FaUser className="mr-2" />
                  <span className="mr-1">Admin</span>
                  <FaCaretDown className="ml-1" />
                </button>
                {isMobileUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                    <div className="py-2">
                      <a
                        href="/admin/add-product"
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-sky-100"
                      >
                        <FaBoxOpen className="inline mr-2" />
                        Ürün Ekle
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/cart"
                className="text-white px-4 py-2 flex items-center"
              >
                <FaShoppingCart className="mr-2" />
                <span>Sepetim</span>
                {cartItemCount > 0 && (
                  <div className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </div>
                )}
              </a>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sky-400">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="w-full py-2 pl-4 pr-10 rounded-full bg-white bg-opacity-20 border border-sky-400 focus:outline-none focus:bg-opacity-30 text-white placeholder-sky-100"
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
                    <FaCaretDown
                      className={`transform transition-transform duration-200 ${
                        isMobileUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMobileUserMenuOpen && (
                    <button
                      onClick={logout}
                      className="text-white py-2 px-4 pl-10 flex items-center w-full bg-sky-800 bg-opacity-30"
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
              <div className="mt-4 pt-4 border-t border-sky-400">
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
                  <FaCaretDown
                    className={`transform transition-transform duration-200 ${
                      isMobileCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileCategoriesOpen && (
                  <div className="bg-sky-800 bg-opacity-30">
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href={category.path}
                        className="text-white py-2 px-4 pl-8 block hover:bg-sky-700"
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sepetim - EN SONDA */}
              <div className="mt-4 pt-4 border-t border-sky-400">
                {user?.role === "admin" ? (
                  <div>
                    <button
                      onClick={() =>
                        setIsMobileUserMenuOpen(!isMobileUserMenuOpen)
                      }
                      className="text-white py-2 px-4 flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>Admin</span>
                      </div>
                      <FaCaretDown
                        className={`transform transition-transform duration-200 ${
                          isMobileUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isMobileUserMenuOpen && (
                      <div className="bg-sky-800 bg-opacity-30">
                        <a
                          href="/admin/add-product"
                          className="text-white py-2 px-4 pl-10 flex items-center w-full hover:bg-sky-900"
                        >
                          <FaBoxOpen className="mr-2" />
                          Ürün Ekle
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="/cart"
                    className="text-white py-2 px-4 flex items-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    <span>Sepetim</span>
                    {cartItemCount > 0 && (
                      <div className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </div>
                    )}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
