"use client";
import React, { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie, isTokenExpired, reLogin } from "@/api/login";

export const withAuth = (WrappedComponent: ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        let accessToken = getCookie("access_token");
        const refreshToken = getCookie("refresh_token");

        if (!accessToken || isTokenExpired(accessToken)) {
          if (refreshToken) {
            // Попробуем обновить токен
            const newAccessToken = await reLogin(refreshToken);
            if (newAccessToken) {
              accessToken = newAccessToken;
              setIsAuthenticated(true); // Авторизован, если токен обновился
              return;
            }
          }
          // Если обновить токен не удалось, перенаправляем на логин
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          router.push("/login");
        } else {
          setIsAuthenticated(true); // Токен валиден
        }
      };

      checkAuth();
    }, [router]);

    if (!isAuthenticated) {
      // Можно показать спиннер или пустой экран, пока проверка происходит
      return <div>Проверка авторизации...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};
