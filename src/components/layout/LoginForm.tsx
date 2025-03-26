import React, { useState } from "react";
import { loginApi } from "@/lib/api/login";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { FiUser, FiLock } from "react-icons/fi";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const result = await loginApi.login({ username, password });
      if (result && result.access) {
        await login(result.access); 
        router.push("/Home/summary/ratings"); 
      } else {
        setError("Access токен отсутствует в ответе");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err instanceof Error ? err.message : "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Синяя панель - для мобильных сверху, для десктопа слева */}
      <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 lg:p-12">
        <div className="flex flex-row lg:flex-col items-center lg:items-center text-white max-w-md">
          <Image
            src={logo}
            alt="Логотип"
            width={80}
            height={80}
            className="lg:w-[160px] lg:h-[160px] rounded-2xl mr-4 lg:mr-0 lg:mb-4"
          />
          <div className="text-center">
            <p className="text-base lg:text-xl text-gray-200 font-medium uppercase font-inter lg:mt-4">
              <span className="block">МОНИТОРИНГ ОЦЕНКИ ДЕЯТЕЛЬНОСТИ СУДОВ</span>

            </p>
          </div>
        </div>
      </div>

      {/* Форма входа - для мобильных снизу, для десктопа справа */}
      <div className="w-full lg:w-2/3 flex flex-grow items-center justify-center p-4 lg:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 space-y-4 lg:space-y-6">
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4 lg:mb-6 text-center">
              Вход в систему
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Имя пользователя"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 
                   rounded-xl text-gray-800 text-sm transition-all duration-300
                   focus:outline-none focus:border-blue-500 focus:ring-4 
                   focus:ring-blue-200/50"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 
                   rounded-xl text-gray-800 text-sm transition-all duration-300
                   focus:outline-none focus:border-blue-500 focus:ring-4 
                   focus:ring-blue-200/50"
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300
                 hover:from-blue-700 hover:to-blue-800 focus:outline-none 
                 focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 
                 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Вход...</span>
                  </div>
                ) : (
                  "Войти в систему"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;