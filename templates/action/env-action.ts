"use server";

/**
 * Получает переменные окружения с сервера
 *
 * @param {string[]} environments - Список имен переменных окружения.
 *
 * @example
 * const env = await envAction(["API_URL"]);
 * console.log(env.API_URL); // "https://example.com"
 */
export const envAction = async (environments: string[]) => {
  try {
    const environmentObj: Record<string, string | boolean> = {};

    for (const env of environments) {
      const value = process.env[env];
      if (value) {
        if (value === "true") {
          environmentObj[env] = true;
        } else if (value === "false") {
          environmentObj[env] = false;
        } else {
          environmentObj[env] = value;
        }
      }
    }

    return { data: environmentObj, error: null };
  } catch (error: any) {
    console.error("Error fetching environment variables:", error);

    return { data: null, error: error.message };
  }
};
