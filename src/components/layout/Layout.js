import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  // Header yüksekliğini takip etmek için state tanımlayalım
  const [headerHeight, setHeaderHeight] = useState(0);

  // Header yüksekliğini ölçmek için
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    // Sayfa yüklendiğinde ve yeniden boyutlandığında ölç
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" style={{ paddingTop: `${headerHeight}px` }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
