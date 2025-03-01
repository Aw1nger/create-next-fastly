"use client";

import { GetPayload } from "@/shared/lib/jwt";
import { UserSchema } from "@/shared/model/user";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import { z } from "zod";

interface AuthContextInterface {
  user: z.infer<typeof UserSchema>;
  isLoading: boolean;
  refetchSession: () => void;
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

function sessionOption() {
  return queryOptions({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        return await GetPayload();
      } catch {
        return null;
      }
    },
    placeholderData: keepPreviousData,
    initialData: null,
    refetchInterval: 1000 * 60 * 4,
  });
}

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const {
    data: user,
    isLoading,
    refetch: refetchSession,
  } = useQuery(sessionOption());
  console.log(user);

  return (
    <AuthContext.Provider value={{ user, isLoading, refetchSession }}>
      {children}
    </AuthContext.Provider>
  );
};
