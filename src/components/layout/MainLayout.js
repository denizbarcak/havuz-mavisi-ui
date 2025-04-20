import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-32 min-h-screen bg-gray-100">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
