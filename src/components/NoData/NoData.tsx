export default function NoData() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-sky-50 text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Данные не найдены
        </h2>
        <p className="text-gray-600 mb-5">
          За выбранный период данные не найдены
        </p>
        <div className="pt-4 border-t border-gray-100">

        </div>
      </div>
    </div>
  );
} 