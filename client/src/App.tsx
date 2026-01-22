// Your updated App.tsx (keep this exactly as you have it – it will now work)

import { Route } from "wouter";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute"; // ← This will now exist

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import MealLog from "@/pages/meal-log";
import Coach from "@/pages/coach";
import Reminders from "@/pages/reminders";
import Profile from "@/pages/profile";
import Recipes from "@/pages/recipes";
import Trends from "@/pages/trends";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

// Home route – redirects logged-in users to dashboard
const HomeRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [, navigate] = useLocation();

  if (isLoggedIn) {
    navigate("/dashboard");
    return null;
  }

  return <Landing />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Route path="/" component={HomeRoute} />
        <Route path="api/login" component={Login} />

        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/meals">
          <ProtectedRoute>
            <MealLog />
          </ProtectedRoute>
        </Route>

        <Route path="/coach">
          <ProtectedRoute>
            <Coach />
          </ProtectedRoute>
        </Route>

        <Route path="/reminders">
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        </Route>

        <Route path="/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>

        <Route path="/recipes">
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        </Route>

        <Route path="/trends">
          <ProtectedRoute>
            <Trends />
          </ProtectedRoute>
        </Route>

        <Route>
          <NotFound />
        </Route>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;