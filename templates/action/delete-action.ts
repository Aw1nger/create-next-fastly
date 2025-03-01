"use server";

import api from "@/shared/action/axios-instance";
import { AxiosError } from "axios";

export async function deleteAction<queryType>(url: string, query?: queryType) {
  try {
    const response = await api.delete(url, {
      params: query,
    });

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
