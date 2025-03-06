import { ZodError, ZodSchema } from "zod";

/**
 * Обёртка для выполнения API-запросов с валидацией ответа через Zod.
 * @template ReturnType - Тип ожидаемого ответа от API.
 * @template Args - Тип аргументов, передаваемых в функцию API.
 * @param apiFn - Функция, выполняющая запрос к API.
 * @param schema - Zod-схема для валидации ответа.
 * @param args - Аргументы для функции API.
 * @returns Типизированный результат валидации.
 * @throws {Error} Если запрос завершился с ошибкой или валидация не прошла.
 */

export async function apiHandler<ReturnType>(
  apiFn: () => Promise<{
    data: ReturnType | null;
    error: string | null;
  }>,
  schema: ZodSchema<ReturnType>,
): Promise<ReturnType> {
  try {
    const result = await apiFn();

    if (result.error) {
      throw new Error(result.error || "Данные не получены от сервера");
    }
    console.log(result);

    return schema.parse(result.data);
  } catch (error: unknown) {

    if (error instanceof ZodError) {
      console.error("Zod parse error:", error.message, error.format());
      throw new Error("Невалидный ответ сервера, попробуйте позже!");
    } else {
      // @ts-ignore
      throw new Error(error.message);
    }

  }
}
