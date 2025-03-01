"use server";

import api from "@/shared/action/axios-instance";
import { setCookieList } from "@/shared/lib/cookies";
import { AxiosError } from "axios";

export async function patchAction<dataType>(url: string, data?: dataType) {
  try {
    const response = await api.patch(url, data);

    await setCookieList(response.headers["set-cookie"] ?? []);

    return { data: response.data, error: null };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Ошибка сервера:", error);

      return {
        data: null,
        error: error.response?.data?.message || "Произошла ошибка на сервере",
      };
    }

    console.error("Неизвестная ошибка:", error);
    return {
      data: null,
      error: "Произошла неизвестная ошибка",
    };
  }
}
