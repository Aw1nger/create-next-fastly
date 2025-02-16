import { ZodSchema } from "zod";

/**
 * Обертка для работы с API
 * @returns {ReturnType} Распаршеный типизированный ответ.
 */
export async function apiHandler<ReturnType>(
  apiFn: () => Promise<{
    data: ReturnType | null;
    error: any | null;
  }>,
  schema: ZodSchema<ReturnType>,
): Promise<ReturnType> {
  try {
    const result = await apiFn();

    if ((result as any)?.error) {
      throw new Error((result as any).error);
    }
    console.log(result);

    const parsedData = schema.parse(result.data);

    return parsedData;
  } catch (error: any) {
    console.error("API Error:", error.message);

    throw error;
  }
}
