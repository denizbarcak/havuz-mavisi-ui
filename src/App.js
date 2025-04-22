import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminRoute from "./components/auth/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StockTrackingPage from "./pages/StockTrackingPage";
import "./App.css";

// Bu komponent BrowserRouter içinde AuthProvider'ı saracak
function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Layout>
                <CartPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Layout>
                <FavoritesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductDetailPage />
            </Layout>
          }
        />
        <Route
          path="/category/chemicals"
          element={
            <Layout>
              <CategoryPage categoryId="chemicals" />
            </Layout>
          }
        />
        <Route
          path="/category/cleaning"
          element={
            <Layout>
              <CategoryPage categoryId="cleaning" />
            </Layout>
          }
        />
        <Route
          path="/category/construction"
          element={
            <Layout>
              <CategoryPage categoryId="construction" />
            </Layout>
          }
        />
        <Route
          path="/category/sauna-spa"
          element={
            <Layout>
              <CategoryPage categoryId="sauna-spa" />
            </Layout>
          }
        />
        <Route
          path="/category/garden"
          element={
            <Layout>
              <CategoryPage categoryId="garden" />
            </Layout>
          }
        />
        <Route
          path="/category/water-systems"
          element={
            <Layout>
              <CategoryPage categoryId="water-systems" />
            </Layout>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <Layout>
                <AddProductPage />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <Layout>
                <EditProductPage />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock-tracking"
          element={
            <AdminRoute>
              <Layout>
                <StockTrackingPage />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-4xl font-bold text-blue-500 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Sayfa bulunamadı</p>
                <a
                  href="/"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Ana Sayfaya Dön
                </a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
