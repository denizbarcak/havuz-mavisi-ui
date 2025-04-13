import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// JWT token'dan payload kısmını çıkarıp decode eder
const parseJwt = (token) => {
  try {
    // Token'ın payload kısmını (ikinci kısım) alıp decode et
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Token varsa kullanıcı bilgisini al
    const token = localStorage.getItem("token");
    if (token) {
      // Token'dan kullanıcı bilgilerini çıkar
      const decodedToken = parseJwt(token);
      if (decodedToken) {
        setUser({
          token,
          email: decodedToken.email,
          role: decodedToken.role,
          // Kullanıcı adı doğrudan token'da yok, bu nedenle email'den çıkarıyoruz
          // @ işaretinden önceki kısmı kullanıcı adı olarak kullanabiliriz
          name: decodedToken.email
            ? decodedToken.email.split("@")[0].toUpperCase()
            : "KULLANICI",
        });
      } else {
        // Token geçersizse veya decode edilemiyorsa çıkış yap
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Token'ı decode et ve kullanıcı bilgilerini çıkar
        const decodedToken = parseJwt(data.token);
        setUser({
          token: data.token,
          email: decodedToken.email,
          role: decodedToken.role,
          // @ işaretinden önceki kısmı kullanıcı adı olarak kullan
          name: decodedToken.email
            ? decodedToken.email.split("@")[0].toUpperCase()
            : "KULLANICI",
        });

        navigate("/");
        return { success: true };
      } else {
        return { success: false, message: data.error || "Giriş başarısız" };
      }
    } catch (error) {
      return { success: false, message: "Bağlantı hatası" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.error || "Kayıt başarısız" };
      }
    } catch (error) {
      return { success: false, message: "Bağlantı hatası" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
