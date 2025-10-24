import type { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  // Acá más adelante vas a agregar QueryClientProvider, ThemeProvider, etc.
  return <>{children}</>;
};
