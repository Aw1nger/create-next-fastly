"use server";

import api from "@/shared/action/axios-instance";
import { UserSchema } from "@/shared/model/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

export const GetPayload = async (): Promise<z.infer<typeof UserSchema>> => {
  try {
    await api.get("/users/token/verify");
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.decode(token) as { [key: string]: any };
    console.log(decoded);

    return UserSchema.parse(decoded);
  } catch (e) {
    console.log(e);
    throw new Error("Invalid token or expired token.");
  }
};
