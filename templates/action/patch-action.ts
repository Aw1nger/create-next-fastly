"use server";

import axios from "axios";
import { cookies } from "next/headers";

function parseSetCookie(setCookieStr: string) {
  const parts = setCookieStr.split(";").map((part) => part.trim());
  const [key, value] = parts[0].split("=");

  const cookieObj: Record<string, any> = { key, value };

  parts.slice(1).forEach((part) => {
    const [key, value] = part.split("=");
    cookieObj[key.toLowerCase()] = value || true;
  });

  return cookieObj;
}

export async function patchAction<dataType>(url: string, data?: dataType) {
  try {
    const CookieStore = await cookies();

    const storedCookies = CookieStore.getAll();
    const cookieHeader = storedCookies
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const headers: Record<string, string> = {
      Cookie: cookieHeader,
    };

    const response = await axios.patch(`${process.env.API_URL}${url}`, data, {
      withCredentials: true,
      headers,
    });

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      setCookieHeader.forEach((cookieStr: string) => {
        const parsedCookie = parseSetCookie(cookieStr);
        CookieStore.set(parsedCookie.key, parsedCookie.value, {
          path: parsedCookie.path || "/",
          expires: parsedCookie.expires
            ? new Date(parsedCookie.expires)
            : undefined,
          httpOnly: !!parsedCookie.httponly,
          secure: !!parsedCookie.secure,
          sameSite: parsedCookie.samesite || "Lax",
        });
      });
    }

    return { data: response.data, error: null };
  } catch (error: any) {
    console.error(
      "Ошибка сервера:",
      error.response?.data?.message || error.message,
    );

    return {
      data: null,
      error: error.response?.data?.message || "Произошла ошибка на сервере",
    };
  }
}
