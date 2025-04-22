import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  // Admin stok takibi sayfasında header'ın sabit kalmamasını sağla
  const isStockTrackingPage = location.pathname === "/admin/stock-tracking";

  return (
    <div className="flex flex-col min-h-screen">
      <div className={isStockTrackingPage ? "relative" : ""}>
        <Header fixedPosition={!isStockTrackingPage} />
      </div>
      <main className={`flex-grow ${isStockTrackingPage ? "pt-0" : "pt-28"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
