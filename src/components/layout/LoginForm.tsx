"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { loginApi } from "@/lib/api/login";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext"; 
import dynamic from "next/dynamic";

const FiUser = dynamic(() => import("react-icons/fi").then(mod => mod.FiUser), { ssr: false });
const FiLock = dynamic(() => import("react-icons/fi").then(mod => mod.FiLock), { ssr: false });
const FiAlertCircle = dynamic(() => import("react-icons/fi").then(mod => mod.FiAlertCircle), { ssr: false });
const FiEye = dynamic(() => import("react-icons/fi").then(mod => mod.FiEye), { ssr: false });
const FiEyeOff = dynamic(() => import("react-icons/fi").then(mod => mod.FiEyeOff), { ssr: false });
const RiScales3Line = dynamic(() => import("react-icons/ri").then(mod => mod.RiScales3Line), { ssr: false });

const LoginForm: React.FC = () => {
  // Состояния формы
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Ссылки и хуки
  const { language, toggleLanguage, getTranslation } = useLanguage(); // Получаем getTranslation через useLanguage
  const { login } = useAuth();
  const router = useRouter();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Эффект автоматического фокуса и анимации страницы при загрузке
  useEffect(() => {
    setIsPageLoaded(true);
    const timer = setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Обработчик изменения полей ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError(null);
  }, [error]);

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError(getTranslation("LoginForm_EmptyFields")); // Убираем language, так как getTranslation использует текущий язык по умолчанию
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginApi.login({
        username: credentials.username,
        password: credentials.password,
      });

      if (result && result.access) {
        await login(result.access);
        router.push("/Home/summary/ratings");
      } else {
        setError(getTranslation("LoginForm_NoToken") || "Access токен отсутствует в ответе");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err instanceof Error ? err.message : getTranslation("LoginForm_Error") || "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  // Переключение видимости пароля
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Обработчик нажатия клавиши Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    },
    [isLoading]
  );

  // Стиль для скролла и центрирования
  const scrollStyle: React.CSSProperties = {
    overflowY: "auto",
    height: "100vh",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div
      style={scrollStyle}
      className={`bg-gradient-to-br from-slate-100 to-slate-200 transition-opacity duration-1000 ease-in-out ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
      data-testid="login-form-container"
    >
      {/* Фоновые элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/pattern-grid.svg')] opacity-[0.03]"></div>
        <div className="absolute -top-64 -right-64 w-[40rem] h-[40rem] bg-blue-800 opacity-[0.03] rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-indigo-700 opacity-[0.05] rounded-full mix-blend-multiply blur-3xl"></div>
      </div>

      {/* Шапка */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl relative overflow-hidden z-10 py-6 md:py-6 sm:py-4 h-auto">
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>

        {/* Переключатель языка */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex z-20 animate-fadeIn">
          <div className="bg-blue-100/30 backdrop-blur-sm rounded-md overflow-hidden border border-blue-200/50 shadow-sm">
            <button
              onClick={toggleLanguage} // Используем toggleLanguage из useLanguage
              aria-label={language === "ru" ? "Переключить на кыргызский" : "Переключить на русский"}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold transition-all duration-300 ${
                language === "ru" ? "bg-blue-800 text-white" : "text-white hover:bg-blue-400/50"
              }`}
            >
              RU
            </button>
            <button
              onClick={toggleLanguage}
              aria-label={language === "ky" ? "Переключить на русский" : "Переключить на кыргызский"}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold transition-all duration-300 ${
                language === "ky" ? "bg-blue-800 text-white" : "text-white hover:bg-blue-400/50"
              }`}
            >
              KY
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-xl transform transition-transform duration-300 hover:scale-105 flex-shrink-0">
            <Image
              src={logo}
              alt="Логотип"
              width={40}
              height={40}
              className="rounded-lg animate-pulse-subtle sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]"
              priority
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold animate-slideUp">
              {getTranslation("LoginForm_Welcome")}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl animate-slideUp animation-delay-300">
              {getTranslation("LoginForm_Subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Основной контент - форма входа */}
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md transform transition-all duration-700 ease-out animate-float">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-7 sm:p-8 border border-gray-200/50 hover:shadow-blue-500/10 transition-all duration-500 ease-in-out group">
            {/* Эффект свечения */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-xl opacity-5 group-hover:opacity-15 transition duration-1000 animate-glow"></div>

            <div className="text-center mb-6 mt-2 animate-slideUp animation-delay-300">
              <div className="flex justify-center mb-4">
                <RiScales3Line className="w-12 h-12 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {getTranslation("LoginForm_LoginTitle")}
              </h2>
              <p className="text-gray-500 text-sm">
                {getTranslation("LoginForm_LoginSubtitle")}
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 animate-slideUp animation-delay-500" onKeyDown={handleKeyDown}>
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-1.5 transition-all duration-300 hover:text-blue-600">
                  {getTranslation("LoginForm_Username")}
                </label>
                <div className="relative transition-all duration-300 group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300 group-focus-within:text-blue-600">
                    <FiUser className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="username"
                    ref={usernameInputRef}
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                    onFocus={(e) => e.target.setAttribute("placeholder", "")}
                    onBlur={(e) => e.target.setAttribute("placeholder", getTranslation("LoginForm_Username"))}
                    placeholder={getTranslation("LoginForm_Username")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 shadow-sm hover:shadow-md"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1.5 transition-all duration-300 hover:text-blue-600">
                  {getTranslation("LoginForm_Password")}
                </label>
                <div className="relative transition-all duration-300 group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all duration-300 group-focus-within:text-blue-600">
                    <FiLock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    onFocus={(e) => e.target.setAttribute("placeholder", "")}
                    onBlur={(e) => e.target.setAttribute("placeholder", getTranslation("LoginForm_Password"))}
                    placeholder={getTranslation("LoginForm_Password")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 pr-10 p-3 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 shadow-sm hover:shadow-md"
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-200"
                  >
                    {showPassword ? <FiEye className="h-5 w-5" aria-hidden="true" /> : <FiEyeOff className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" aria-live="assertive" className="p-4 rounded-lg text-sm bg-red-50 border-l-4 border-red-500 text-red-600 animate-shake shadow-sm">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                aria-label={isLoading ? getTranslation("LoginForm_Loading") : getTranslation("LoginForm_LoginButton")}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{getTranslation("LoginForm_Loading")}</span>
                  </div>
                ) : (
                  getTranslation("LoginForm_LoginButton")
                )}
              </button>

              <div className="text-center text-xs text-gray-500 mt-4 animate-fadeIn animation-delay-700">
                {getTranslation("LoginForm_HelpText")}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* CSS для анимаций */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse-subtle {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes glow {
          0% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
          100% {
            opacity: 0.05;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite alternate;
        }

        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }

        .animate-glow {
          animation: glow 3s infinite;
        }

        .animate-shake {
          animation: shake 0.5s linear;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;