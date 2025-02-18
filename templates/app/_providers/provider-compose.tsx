import { ComposeChildren } from "@/shared/lib/helpers";
import { QueryProvider } from "@/shared/provider/query-provider";
import { ThemeProvider } from "@/shared/provider/theme-provider";
import React from "react";

export const ProviderCompose = ({
                                  children,
                                }: {
  children: React.ReactNode;
}) => {
  return (
    <ComposeChildren>
      <ThemeProvider />
      <QueryProvider />
      {children}
    </ComposeChildren>
  );
};
