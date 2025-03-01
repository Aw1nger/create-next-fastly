"use server";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.API_URL || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
};

const getCookieList = async () => {
  const CookieStore = await cookies();

  const storedCookies = CookieStore.getAll();
  return storedCookies.map(({ name, value }) => `${name}=${value}`).join("; ");
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken();
    const cookies = await getCookieList();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (cookies) {
      config.headers.set("Cookie", cookies);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => {
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
      const cookieStore = await cookies();
      setCookieHeaders.forEach((cookie: string) => {
        const [cookieName, ...rest] = cookie.split("=");
        const cookieValue = rest.join("=");
        cookieStore.set(cookieName.trim(), cookieValue.trim(), {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
          throw new Error("Refresh token отсутствует");
        }

        const { data } = await axios.post(
          `${API_BASE_URL}/users/token/refresh`,
          {
            token: refreshToken,
          },
        );

        cookieStore.set("accessToken", data.access, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 15 * 60,
          path: "/",
        });

        cookieStore.set("refreshToken", data.refresh, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Не удалось обновить токен:", refreshError);
        redirect("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
