import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaSync,
  FaInfoCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    uppercase: true,
    lowercase: true,
    symbol: true,
  });

  const { login, register } = useAuth();

  // Rastgele güvenlik kodu oluşturma fonksiyonu
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  // Güvenlik kodunu yenileme
  const refreshCaptcha = () => {
    generateCaptcha();
  };

  // Şifre validation fonksiyonu
  const validatePassword = (password) => {
    const errors = {
      length: password.length < 8,
      uppercase: !/[A-Z]/.test(password),
      lowercase: !/[a-z]/.test(password),
      symbol: !/[-+_!@#$%^&*.,?]/.test(password),
    };

    setPasswordErrors(errors);

    // Tüm kuralları karşılıyor mu?
    return !Object.values(errors).some((error) => error);
  };

  // Şifre değiştiğinde validation çalıştır
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      validatePassword(newPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Güvenlik kodu kontrolü
        if (showCaptcha) {
          if (userCaptcha !== captchaCode) {
            setMessage("Güvenlik kodu hatalı!");
            setLoading(false);
            // Güvenlik kodunu yenile
            generateCaptcha();
            // Kullanıcının girdiği kodu temizle
            setUserCaptcha("");
            return;
          }
          // Doğru güvenlik kodu girilse bile yeni kod oluştur
          generateCaptcha();
          // Kullanıcının girdiği kodu temizle
          setUserCaptcha("");
        }

        // Giriş işlemi
        const result = await login(email, password);
        if (!result.success) {
          setLoginAttempts((prev) => prev + 1);
          if (loginAttempts >= 2 && !showCaptcha) {
            setShowCaptcha(true);
            generateCaptcha();
          }
          setMessage(result.message);
        } else {
          // Başarılı giriş - sayaçları sıfırla
          setLoginAttempts(0);
          setShowCaptcha(false);
          setUserCaptcha("");
        }
      } else {
        // Kayıt işlemi
        if (!name || !email || !password) {
          setMessage("Tüm alanları doldurunuz");
          setLoading(false);
          return;
        }

        // Şifre validasyonu
        if (!validatePassword(password)) {
          setMessage("Şifre gereksinimleri karşılanmıyor");
          setLoading(false);
          return;
        }

        const result = await register(name, email, password);
        if (result.success) {
          setMessage("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
          setIsLogin(true);
          setName("");
          setEmail("");
          setPassword("");
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      setMessage("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-sky-800 py-4">
            <h2 className="text-center text-white font-bold text-2xl">
              {isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </h2>
          </div>

          <div className="p-6">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-2 font-medium ${
                  isLogin
                    ? "text-sky-800 border-b-2 border-sky-800"
                    : "text-gray-500"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Giriş Yap
              </button>
              <button
                className={`flex-1 py-2 font-medium ${
                  !isLogin
                    ? "text-sky-800 border-b-2 border-sky-800"
                    : "text-gray-500"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Kayıt Ol
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  message.includes("başarılı")
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-red-100 text-red-700 border border-red-400"
                }`}
              >
                <p className="font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>

                {/* Şifre gereksinimleri - Sadece kayıt olma formu için */}
                {!isLogin && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-700 mb-1 font-medium">
                      Şifre gereksinimleri:
                    </p>
                    <ul className="space-y-1 pl-1">
                      <li
                        className={`flex items-center ${
                          passwordErrors.length
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        <span className="mr-1">
                          {passwordErrors.length ? "✕" : "✓"}
                        </span>{" "}
                        En az 8 karakter
                      </li>
                      <li
                        className={`flex items-center ${
                          passwordErrors.uppercase
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        <span className="mr-1">
                          {passwordErrors.uppercase ? "✕" : "✓"}
                        </span>{" "}
                        En az bir büyük harf (A-Z)
                      </li>
                      <li
                        className={`flex items-center ${
                          passwordErrors.lowercase
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        <span className="mr-1">
                          {passwordErrors.lowercase ? "✕" : "✓"}
                        </span>{" "}
                        En az bir küçük harf (a-z)
                      </li>
                      <li
                        className={`flex items-center ${
                          passwordErrors.symbol
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        <span className="mr-1">
                          {passwordErrors.symbol ? "✕" : "✓"}
                        </span>{" "}
                        En az bir özel karakter (-, +, @, #, $ vb.)
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {showCaptcha && isLogin && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Güvenlik Kodu
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <input
                          type="text"
                          className="w-full focus:outline-none"
                          placeholder="Güvenlik kodunu giriniz"
                          value={userCaptcha}
                          onChange={(e) => setUserCaptcha(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-100 px-4 py-2 rounded-md font-mono text-lg select-none">
                        {captchaCode}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-2 text-sky-800 hover:text-sky-900"
                      >
                        <FaSync />
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                  <a href="#" className="text-sm text-sky-800 hover:underline">
                    Şifremi unuttum
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-sky-800 hover:bg-sky-900 text-white font-semibold py-3 px-4 rounded-md transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "İşleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
              </button>
            </form>

            {isLogin ? (
              <p className="mt-6 text-center text-sm text-gray-600">
                Hesabınız yok mu?
                <button
                  onClick={() => setIsLogin(false)}
                  className="ml-1 text-sky-800 hover:underline"
                >
                  Kayıt Olun
                </button>
              </p>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-600">
                Zaten hesabınız var mı?
                <button
                  onClick={() => setIsLogin(true)}
                  className="ml-1 text-sky-800 hover:underline"
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
