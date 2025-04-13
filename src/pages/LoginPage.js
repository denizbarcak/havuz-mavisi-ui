import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 py-4">
            <h2 className="text-center text-white font-bold text-2xl">
              {isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </h2>
          </div>

          <div className="p-6">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-2 font-medium ${
                  isLogin
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Giriş Yap
              </button>
              <button
                className={`flex-1 py-2 font-medium ${
                  !isLogin
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Kayıt Ol
              </button>
            </div>

            <form>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Ad Soyad
                  </label>
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <FaUser className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="w-full focus:outline-none"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  E-posta
                </label>
                <div className="flex items-center border rounded-md px-3 py-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    className="w-full focus:outline-none"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Şifre
                </label>
                <div className="flex items-center border rounded-md px-3 py-2">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    className="w-full focus:outline-none"
                    placeholder={isLogin ? "••••••••" : "En az 8 karakter"}
                  />
                </div>
              </div>

              {isLogin && (
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember-me" className="mr-2" />
                    <label
                      htmlFor="remember-me"
                      className="text-sm text-gray-600"
                    >
                      Beni hatırla
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-500 hover:underline">
                    Şifremi unuttum
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-colors"
              >
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
              </button>
            </form>

            {isLogin ? (
              <p className="mt-6 text-center text-sm text-gray-600">
                Hesabınız yok mu?
                <button
                  onClick={() => setIsLogin(false)}
                  className="ml-1 text-blue-500 hover:underline"
                >
                  Kayıt Olun
                </button>
              </p>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-600">
                Zaten hesabınız var mı?
                <button
                  onClick={() => setIsLogin(true)}
                  className="ml-1 text-blue-500 hover:underline"
                >
                  Giriş Yapın
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
