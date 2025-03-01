"use server";

/**
 * Получает переменные окружения с сервера
 *
 * @param {string[]} environments - Список имен переменных окружения.
 *
 */
export const envAction = async (environments: string[]) => {
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
};
