import React from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VocabularyPage } from "./pages/VocabularyPage";
import { Sidebar } from "./components/layout/sidebar";
// ... other imports

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={VocabularyPage} />
            <Route path="/vocabulary" component={VocabularyPage} />
            <Route path="/vocabulary/:groupId" component={VocabularyPage} />
            {/* ... other routes */}
          </Switch>
        </main>
      </div>
    </QueryClientProvider>
  );
} 