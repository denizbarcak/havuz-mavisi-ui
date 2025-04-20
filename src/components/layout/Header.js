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
  FaUserCog,
  FaPlus,
  FaCheck,
  FaTimes as FaTimesCircle,
} from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { useAuth } from "../../context/AuthContext";
import {
  getCart,
  getAllProducts,
  getSubCategoriesByParent,
  addSubCategory,
} from "../../services/api";

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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [currentParentCategoryIndex, setCurrentParentCategoryIndex] =
    useState(null);
  const [categories, setCategories] = useState([
    {
      name: "Havuz Kimyasalları",
      path: "/category/chemicals",
      key: "chemicals",
      subCategories: [],
    },
    {
      name: "Havuz Temizlik Malzemesi",
      path: "/category/cleaning",
      key: "cleaning",
      subCategories: [],
    },
    {
      name: "Havuz Yapı Malzemeleri",
      path: "/category/construction",
      key: "construction",
      subCategories: [],
    },
    {
      name: "Sauna ve Spa",
      path: "/category/sauna-spa",
      key: "sauna-spa",
      subCategories: [],
    },
    {
      name: "Havuz Bahçe Ürünleri",
      path: "/category/garden",
      key: "garden",
      subCategories: [],
    },
    {
      name: "Su Arıtma ve Yumuşatma Sistemleri",
      path: "/category/water-systems",
      key: "water-systems",
      subCategories: [],
    },
  ]);
  const searchRef = useRef(null);
  const addSubcategoryInputRef = useRef(null);
  const { user, logout } = useAuth();

  // Refs for dropdown menus
  const userMenuRef = useRef(null);
  const productsMenuRef = useRef(null);
  const adminMenuRef = useRef(null);
  const categoryRefs = useRef([]);

  // Timeout refs for closing menus
  const userMenuTimeoutRef = useRef(null);
  const productsMenuTimeoutRef = useRef(null);
  const adminMenuTimeoutRef = useRef(null);
  const categoryTimeoutRefs = useRef([]);

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

  // Alt kategorileri yükle
  useEffect(() => {
    // Havuz Kimyasalları kategorisinin indeksi
    const chemicalsIndex = categories.findIndex(
      (cat) => cat.key === "chemicals"
    );

    const fetchSubCategories = async (index) => {
      try {
        const categoryKey = categories[index].key;
        const response = await getSubCategoriesByParent(categoryKey);

        // Backend'den gelen cevap kontrol ediliyor
        const subCategories = Array.isArray(response) ? response : [];

        // Alt kategorileri güncelle
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[index].subCategories = subCategories.map((sc) => ({
            ...sc,
            path: `${updatedCategories[index].path}/${
              sc.slug ||
              sc.id ||
              sc._id ||
              (sc.name && sc.name.toLowerCase().replace(/ /g, "-")) ||
              "subcategory"
            }`,
          }));
          return updatedCategories;
        });
      } catch (error) {
        console.error(
          `${
            categories[index]?.name || "Kategori"
          } alt kategorileri yüklenirken hata:`,
          error
        );
        // Hata durumunda boş alt kategori dizisi ata
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[index].subCategories = [];
          return updatedCategories;
        });
      }
    };

    // Sayfa ilk yüklendiğinde Havuz Kimyasalları kategorisi için alt kategorileri yükle
    if (chemicalsIndex !== -1) {
      fetchSubCategories(chemicalsIndex);
    }

    // Aktif kategori değiştiğinde o kategorinin alt kategorilerini yükle
    if (
      activeCategoryIndex !== null &&
      activeCategoryIndex !== chemicalsIndex
    ) {
      fetchSubCategories(activeCategoryIndex);
    }
  }, [activeCategoryIndex]);

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

  // Handle category mouse enter
  const handleCategoryMouseEnter = (index) => {
    // Tüm kategori zaman aşımlarını temizle
    categoryTimeoutRefs.current.forEach((timeout, i) => {
      if (timeout) {
        clearTimeout(timeout);
        categoryTimeoutRefs.current[i] = null;
      }
    });

    // Aktif kategoriyi ayarla
    setActiveCategoryIndex(index);
  };

  // Handle category mouse leave
  const handleCategoryMouseLeave = (index) => {
    // Sadece fare boşluğa çıktığında menüyü kapat, kategoriler arası geçişte kapatma
    categoryTimeoutRefs.current[index] = setTimeout(() => {
      // Eğer başka bir kategoriye geçilmediyse kapat
      if (activeCategoryIndex === index) {
        setActiveCategoryIndex(null);
      }
    }, 300); // 300ms gecikmeyle kapat, böylece kategoriler arası geçişte yeterli zaman olur
  };

  // Kategoriler konteyneri için genel mouse leave
  const handleCategoriesContainerMouseLeave = () => {
    setTimeout(() => {
      setActiveCategoryIndex(null);
    }, 300);
  };

  // Initialize category refs and timeout refs
  useEffect(() => {
    categoryRefs.current = categories.map(() => React.createRef());
    categoryTimeoutRefs.current = categories.map(() => null);
  }, [categories.length]);

  // Focus input when adding subcategory
  useEffect(() => {
    if (isAddingSubcategory && addSubcategoryInputRef.current) {
      addSubcategoryInputRef.current.focus();
    }
  }, [isAddingSubcategory]);

  // Handle add subcategory
  const handleAddSubcategory = (parentIndex) => {
    setIsAddingSubcategory(true);
    setCurrentParentCategoryIndex(parentIndex);
    setNewSubcategoryName("");
  };

  // Metni capitalize formatına dönüştürme fonksiyonu (ilk harf büyük, diğerleri küçük)
  const capitalizeText = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Save new subcategory
  const saveNewSubcategory = async () => {
    if (newSubcategoryName.trim() === "") return;

    try {
      // Aktif kategorinin key değerini al (MongoDB'deki kategori anahtarı)
      const categoryKey = categories[currentParentCategoryIndex].key;
      const categoryName = categories[currentParentCategoryIndex].name;

      // Alt kategori adını capitalize formatına çevir
      const formattedSubcategoryName = capitalizeText(
        newSubcategoryName.trim()
      );

      // Backend'e alt kategori ekleme isteği gönder
      const response = await addSubCategory({
        name: formattedSubcategoryName,
        parent_category: categoryKey,
      });

      // Backend yanıtı için güvenlik kontrolü
      let subcategory = { id: "", slug: "" };

      if (response && response.subcategory) {
        subcategory = response.subcategory;
      } else if (response && response.id) {
        subcategory = response;
      }

      // Alt kategori nesnesini oluştur
      const newSubCategory = {
        name: formattedSubcategoryName,
        path: `${categories[currentParentCategoryIndex].path}/${
          subcategory.slug ||
          formattedSubcategoryName.toLowerCase().replace(/ /g, "-")
        }`,
        id: subcategory.id || Date.now().toString(), // Geçici ID kullan
        slug:
          subcategory.slug ||
          formattedSubcategoryName.toLowerCase().replace(/ /g, "-"),
      };

      // Kategorileri güncelle
      const updatedCategories = [...categories];

      // Eğer alt kategoriler dizisi yoksa oluştur
      if (!updatedCategories[currentParentCategoryIndex].subCategories) {
        updatedCategories[currentParentCategoryIndex].subCategories = [];
      }

      // Alt kategoriyi listeye ekle
      updatedCategories[currentParentCategoryIndex].subCategories.push(
        newSubCategory
      );

      // State'i güncelle
      setCategories(updatedCategories);

      // Başarılı mesajı göster
      alert(`Yeni alt kategori eklendi: ${formattedSubcategoryName}`);

      // Formu sıfırla
      setIsAddingSubcategory(false);
      setNewSubcategoryName("");

      // Alt menünün açık kalmasını sağla
      // setCurrentParentCategoryIndex(null);
    } catch (error) {
      console.error("Alt kategori eklenirken hata:", error);
      alert("Alt kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Cancel adding subcategory
  const cancelAddSubcategory = () => {
    setIsAddingSubcategory(false);
    setNewSubcategoryName("");
    setCurrentParentCategoryIndex(null);
  };

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveNewSubcategory();
    } else if (e.key === "Escape") {
      cancelAddSubcategory();
    }
  };

  return (
    <header className="bg-sky-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo and Menu Button (Mobile) */}
          <div className="flex items-center pl-0">
            {/* Mobile menu button - Only visible on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-1 mr-1"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Logo */}
            <a href="/" className="text-white font-bold md:text-2xl text-lg">
              Havuz Mavisi
            </a>
          </div>

          {/* Search Bar - Only visible on desktop */}
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

          {/* Mobile Navigation Icons */}
          <div className="md:hidden flex items-center">
            {user ? (
              <button className="text-white p-2">
                <FaUser size={20} />
              </button>
            ) : (
              <a href="/login" className="text-white p-2">
                <FaUser size={20} />
              </a>
            )}

            {user?.role === "admin" ? (
              <div className="relative">
                <button
                  onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                  className="text-white p-2"
                >
                  <GrUserAdmin size={20} />
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
              <a href="/cart" className="text-white p-2 relative">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center -mt-1 -mr-1">
                    {cartItemCount}
                  </div>
                )}
              </a>
            )}
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
                  <GrUserAdmin className="mr-2" />
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

        {/* Mobile Search Bar - Header altında */}
        <div className="md:hidden py-2 px-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
              className="w-full py-2 pl-4 pr-10 rounded-md bg-white bg-opacity-20 border border-sky-400 focus:outline-none focus:bg-opacity-30 text-white placeholder-sky-100"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-white">
              <FaSearch />
            </button>

            {/* Mobile Search Results Dropdown */}
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

        {/* Categories Bar - Desktop için alt kısımda kategoriler */}
        <div
          className="hidden md:flex justify-center pb-1 border-t border-sky-500 pt-1 w-full"
          onMouseLeave={handleCategoriesContainerMouseLeave}
        >
          <div className="flex flex-wrap items-center justify-center w-full">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative mx-4 my-1"
                ref={(el) => (categoryRefs.current[index] = el)}
                onMouseEnter={() => handleCategoryMouseEnter(index)}
                onMouseLeave={() => handleCategoryMouseLeave(index)}
              >
                {index > 0 && (
                  <div className="h-4 border-l border-sky-400 absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4"></div>
                )}
                <div className="flex items-center">
                  <a
                    href={category.path}
                    className="text-white text-sm px-3 py-2 hover:bg-sky-700 rounded transition-colors flex items-center whitespace-nowrap"
                  >
                    {category.name}
                    <FaCaretDown className="ml-1 opacity-70" />
                  </a>
                </div>

                {/* SubCategories Dropdown */}
                {activeCategoryIndex === index && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-56 bg-sky-800 shadow-lg rounded-md z-50 border border-sky-700">
                    <div className="py-2">
                      {category.subCategories &&
                        category.subCategories.map((subCategory, subIndex) => (
                          <a
                            key={subIndex}
                            href={`/category/${category.key}?subcategory=${
                              subCategory.id ||
                              subCategory.slug ||
                              encodeURIComponent(subCategory.name)
                            }`}
                            className="block w-full text-left px-4 py-2 text-white hover:bg-sky-700"
                          >
                            {subCategory.name}
                            {subIndex < category.subCategories.length - 1 && (
                              <div className="border-b border-sky-600 mx-2 mt-2"></div>
                            )}
                          </a>
                        ))}

                      {/* Add New Subcategory Button (Admin only) */}
                      {user?.role === "admin" && (
                        <>
                          {isAddingSubcategory &&
                          currentParentCategoryIndex === index ? (
                            <div className="px-4 py-2">
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  ref={addSubcategoryInputRef}
                                  value={newSubcategoryName}
                                  onChange={(e) =>
                                    setNewSubcategoryName(e.target.value)
                                  }
                                  onKeyDown={handleKeyPress}
                                  placeholder="Alt kategori adı..."
                                  className="w-full px-2 py-1 text-sm text-black rounded"
                                  maxLength={30}
                                />
                              </div>
                              <div className="flex justify-end mt-2 space-x-2">
                                <button
                                  onClick={saveNewSubcategory}
                                  className="text-green-400 hover:text-green-300 p-1 bg-sky-700 rounded"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={cancelAddSubcategory}
                                  className="text-red-400 hover:text-red-300 p-1 bg-sky-700 rounded"
                                >
                                  <FaTimesCircle />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddSubcategory(index)}
                              className="block w-full text-left px-4 py-2 text-white hover:bg-sky-700 flex items-center text-sm"
                            >
                              <FaPlus className="mr-2" />
                              Yeni Alt Kategori
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Menu - Sadece kategoriler */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sky-400 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              {categories.map((category, index) => (
                <div key={index}>
                  <a
                    href={category.path}
                    className="text-white py-3 px-4 hover:bg-sky-700 border-b border-sky-700 flex justify-between items-center"
                    onClick={(e) => {
                      if (category.subCategories?.length > 0) {
                        e.preventDefault();
                        if (isMobileCategoriesOpen === index) {
                          setIsMobileCategoriesOpen(null);
                        } else {
                          setIsMobileCategoriesOpen(index);
                        }
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    {category.name}
                    {category.subCategories?.length > 0 && (
                      <FaAngleDown
                        className={`transition-transform ${
                          isMobileCategoriesOpen === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>

                  {/* Mobile SubCategories */}
                  {(isMobileCategoriesOpen === index ||
                    (index ===
                      categories.findIndex((cat) => cat.key === "chemicals") &&
                      category.subCategories?.length > 0)) && (
                    <div className="bg-sky-800 border-t border-sky-700">
                      {category.subCategories &&
                        category.subCategories.map((subCategory, subIndex) => (
                          <a
                            key={subIndex}
                            href={`/category/${category.key}?subcategory=${
                              subCategory.id ||
                              subCategory.slug ||
                              encodeURIComponent(subCategory.name)
                            }`}
                            className="text-white py-2 px-8 block hover:bg-sky-700"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subCategory.name}
                            {subIndex < category.subCategories.length - 1 && (
                              <div className="border-b border-sky-600 mx-4 mt-2"></div>
                            )}
                          </a>
                        ))}

                      {/* Add New Subcategory Button for Mobile (Admin only) */}
                      {user?.role === "admin" && (
                        <>
                          {isAddingSubcategory &&
                          currentParentCategoryIndex === index ? (
                            <div className="px-8 py-2 border-b border-sky-700">
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  value={newSubcategoryName}
                                  onChange={(e) =>
                                    setNewSubcategoryName(e.target.value)
                                  }
                                  onKeyDown={handleKeyPress}
                                  placeholder="Alt kategori adı..."
                                  className="w-full px-2 py-1 text-sm text-black rounded"
                                  maxLength={30}
                                />
                              </div>
                              <div className="flex justify-end mt-2 space-x-2">
                                <button
                                  onClick={saveNewSubcategory}
                                  className="text-green-400 hover:text-green-300 p-1 bg-sky-700 rounded"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={cancelAddSubcategory}
                                  className="text-red-400 hover:text-red-300 p-1 bg-sky-700 rounded"
                                >
                                  <FaTimesCircle />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddSubcategory(index)}
                              className="text-white py-2 px-8 block hover:bg-sky-700 text-left flex items-center w-full text-sm"
                            >
                              <FaPlus className="mr-2" />
                              Yeni Alt Kategori
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
