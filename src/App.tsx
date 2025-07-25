import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="attendance" element={<div className="p-8 text-center text-muted-foreground">Attendance page coming soon...</div>} />
            <Route path="staff" element={<div className="p-8 text-center text-muted-foreground">Staff management coming soon...</div>} />
            <Route path="workouts" element={<div className="p-8 text-center text-muted-foreground">Workout plans coming soon...</div>} />
            <Route path="billing" element={<div className="p-8 text-center text-muted-foreground">Billing system coming soon...</div>} />
            <Route path="reports" element={<div className="p-8 text-center text-muted-foreground">Reports coming soon...</div>} />
            <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings coming soon...</div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
