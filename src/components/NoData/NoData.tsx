export default function NoData() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-sm">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Данные отсутствуют
        </h2>
        <p className="text-gray-600">
          За выбранный период данные не найдены
        </p>
      </div>
    </div>
  );
} 