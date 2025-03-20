import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Разрешаем только GET-запросы
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  try {
    // Запрашиваем данные с бэкенда
    const response = await fetch("https://opros.sot.kg:443/api/v1/chart/radar/republic/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Если требуется авторизация, добавьте заголовок, например:
        // "Authorization": `Bearer ${process.env.BACKEND_API_TOKEN}`,
      },
    });

    // Проверяем, успешен ли запрос
    if (!response.ok) {
      throw new Error(`Ошибка бэкенда: ${response.status} ${response.statusText}`);
    }

    // Получаем данные в формате JSON
    const data = await response.json();

    // Возвращаем данные клиенту
    res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка при запросе данных радара:", error);
    res.status(500).json({ message: "Ошибка сервера при получении данных радара" });
  }
}