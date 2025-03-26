"use client";
import React, { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie, isTokenExpired, reLogin } from "@/lib/api/login";

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
            const newAccessToken = await reLogin(refreshToken);
            if (newAccessToken) {
              accessToken = newAccessToken;
              setIsAuthenticated(true);
              return;
            }
          }
        
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          
          const pathname = window.location.pathname;
          let loginPath = "/login";
          
          if (pathname.startsWith("/results")) {
            loginPath = "/results/login";
          } else if (pathname.includes("/results/")) {
            const parts = pathname.split('/results/');
            loginPath = parts[0] + "/results/login";
          }
          
          window.location.href = window.location.origin + loginPath;
        } else {
          setIsAuthenticated(true); 
        }
      };

      checkAuth();
    }, [router]);

    if (!isAuthenticated) {
      return <div>Проверка авторизации...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};
