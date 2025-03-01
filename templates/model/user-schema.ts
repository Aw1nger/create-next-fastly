import { z } from "zod";

export const UserSchema = z
.object({
  banner_url: z.string().nullable(),
  dob: z.number().nullable(),
  confirmed_email: z.string().email().nullable(),
  unconfirmed_email: z.string().email().nullable(),
  exp: z.number(),
  firstname: z.string().nullable(),
  id: z.number(),
  ip: z.string(),
  is_active: z.boolean(),
  lastname: z.string().nullable(),
  logo_url: z.string().nullable(),
  patronymic: z.string().nullable(),
  phone: z.string(),
  role: z.enum(["user", "admin", "moderator"]),
  type: z.enum(["auth", "guest"]),
})
.nullable();
