import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { AudioNotificationProvider } from "@/hooks/use-audio-notifications";
import MainLayout from "@/components/layout/main-layout";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Technicians from "@/pages/technicians";
import Settings from "@/pages/settings";
import Invoices from "@/pages/invoices";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";

function AuthenticatedApp() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/technicians" component={Technicians} />
        <Route path="/settings" component={Settings} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AudioNotificationProvider>
            <Toaster />
            {isAuthenticated ? (
              <AuthenticatedApp />
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )}
          </AudioNotificationProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
