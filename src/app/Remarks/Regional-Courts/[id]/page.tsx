import RemarksPage from "@/lib/utils/remarksLogic/RemarksLogic";

function page() {

  return (
    <div><RemarksPage /></div>
  );
}

export function generateStaticParams() {
  // Генерация всех возможных ID от 1 до 81
  const ids = Array.from({ length: 81 }, (_, index) => (index + 1).toString()); // От 1 до 81

  // Генерируем параметры для каждой страницы
  return ids.map((id) => ({
    id: id, // Убедитесь, что id передается как строка
  }));
}

export default page;
