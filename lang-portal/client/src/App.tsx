import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 1000,
      gcTime: 1000,
      retry: 3
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <AppRoutes />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;