"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie, getCurrentUser } from "@/lib/api/login";

// Компонент индикатора загрузки
const LoadingOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        margin: '0 auto',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginTop: '10px', color: '#2563eb' }}>Загрузка...</p>
    </div>
  </div>
);

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: { first_name: string; last_name: string; court: string; role: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = getCookie("access_token");
      if (token) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Ошибка при проверке пользователя:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (token: string) => {
    setShowOverlay(true); // Показываем оверлей перед началом процесса входа
    setIsLoading(true);
    try {
      setCookie("access_token", token);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      
      // Определяем URL перенаправления в зависимости от инстанции пользователя
      let redirectUrl;
      
      // Проверяем роль пользователя
      if (currentUser.role === "Председатель 1 инстанции") {
        redirectUrl = "/results/Home/summary/ratings";
      } else if (currentUser.role === "Председатель 2 инстанции") {
        // Возвращаем первоначальный маршрут
        redirectUrl = "/results/Home/first_instance/ratings";
      } else if (currentUser.role === "Председатель 3 инстанции") {
        redirectUrl = "/results/Home/summary/ratings";
      } else {
        // Если роль не соответствует ни одной из инстанций
        redirectUrl = "/results/Home/summary/ratings";
      }
      
      // Полная перезагрузка страницы с целевым URL
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Ошибка при логине:", error);
      setShowOverlay(false); // Скрываем оверлей при ошибке
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setShowOverlay(true); // Показываем оверлей перед выходом
    
    // Определяем текущий URL для корректного выхода
    const currentUrl = window.location.href;
    let loginUrl = "/login";
    
    // Если мы находимся в URL с /results/, то выходим на /results/login
    if (currentUrl.includes("/results/login")) {
      loginUrl = "/results/login";
    }
    
    // Очищаем данные авторизации
    deleteCookie("access_token");
    setIsAuthenticated(false);
    setUser(null);
    
    // Перезагружаем страницу, чтобы избежать проблем с состоянием
    window.location.href = loginUrl;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
      {showOverlay && <LoadingOverlay />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function getRegionSlug(courtName: string): string {
  const regionMap: { [key: string]: string } = {
    "Таласский областной суд": "Talas",
    "Иссык-кульский областной суд": "Issyk-Kyl",
    "Нарынский областной суд": "Naryn",
    "Баткенский областной суд": "Batken",
    "Чуйский областной суд": "Chyi",
    "Ошский областной суд": "Osh",
    "Жалал-Абадский областной суд": "Djalal-Abad",
    "Бишкекский городской суд": "Bishkek",
  };
  
  return regionMap[courtName] || "unknown";
}