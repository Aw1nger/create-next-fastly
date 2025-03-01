import { cookies } from "next/headers";

interface CookieObject {
  key: string;
  value: string;
  path?: string;
  expires?: string;
  httponly?: boolean;
  secure?: boolean;
  samesite?: "lax" | "strict" | "none";
}

export function parseSetCookie(setCookieStr: string): CookieObject {
  const parts = setCookieStr.split(";").map((part) => part.trim());
  const [key, value] = parts[0].split("=");

  const cookieObj: Record<string, string | boolean> = { key, value };

  parts.slice(1).forEach((part) => {
    const [key, value] = part.split("=");
    const lowerKey = key.toLowerCase();
    cookieObj[lowerKey] = value || true;
  });

  const sameSiteValue = cookieObj.samesite as string | undefined;
  const validSameSite: "lax" | "strict" | "none" | undefined =
    sameSiteValue === "lax" ||
    sameSiteValue === "strict" ||
    sameSiteValue === "none"
      ? sameSiteValue
      : undefined;

  return {
    key: cookieObj.key as string,
    value: cookieObj.value as string,
    path: cookieObj.path as string | undefined,
    expires: cookieObj.expires as string | undefined,
    httponly: cookieObj.httponly as boolean | undefined,
    secure: cookieObj.secure as boolean | undefined,
    samesite: validSameSite,
  };
}

export async function setCookieList(cookieList: string[]) {
  if (cookieList) {
    const CookieStore = await cookies();
    cookieList.forEach((cookieStr: string) => {
      const parsedCookie = parseSetCookie(cookieStr);
      CookieStore.set(parsedCookie.key, parsedCookie.value, {
        path: parsedCookie.path || "/",
        expires: parsedCookie.expires
          ? new Date(parsedCookie.expires)
          : undefined,
        httpOnly: !!parsedCookie.httponly,
        secure: !!parsedCookie.secure,
        sameSite: parsedCookie.samesite || "lax",
      });
    });
  }
}
