"use client";

import { getSession } from "@/entities/session/session";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  firstname: z.string(),
  lastname: z.string(),
  avatar: z.string().url(),
  email: z.string().email(),
  role: z.string(),
});

export interface AuthInterface {
  auth: boolean;
  user: z.infer<typeof UserSchema> | null;
}

interface AuthContextInterface {
  session: AuthInterface;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() must be used within AuthProvider");
  }
  return context;
};

function CachedSession() {
  const [session, setSession] = useState<AuthInterface>({
    auth: false,
    user: null,
  });

  useEffect(() => {
    const cached = localStorage.getItem("session");
    if (cached) {
      try {
        setSession(JSON.parse(cached) as AuthInterface);
      } catch {
        console.error("Failed to parse cached session");
      }
    }
  }, []);

  return session;
}

function sessionOption() {
  return queryOptions({
    queryKey: ["session"],
    queryFn: async () => {
      const session = await getSession();
      localStorage.setItem("session", JSON.stringify(session));
      console.log(session);
      return session;
    },
    placeholderData: keepPreviousData,
    initialData: CachedSession(),
  });
}

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const { data } = useQuery(sessionOption());
  return (
    <AuthContext.Provider value={{ session: data }}>
      {children}
    </AuthContext.Provider>
  );
};
