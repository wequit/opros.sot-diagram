"use client";
import React, { useState, useEffect } from "react";
import LoginForm from "@/components/layout/LoginForm";

export default function LoginPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Очищаем все предыдущие состояния при загрузке страницы логина
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Задержка перед показом формы для очистки предыдущих состояний
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Показываем экран загрузки, пока форма не готова
  if (!isReady) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
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
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      backgroundColor: '#fff'
    }}>
      <LoginForm />
    </div>
  );
} 