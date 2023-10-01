import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CountriesPage } from "./CountriesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CountriesPage />
    </QueryClientProvider>
  );
};
