
import Index from "./pages/Index";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { SocialInbox } from "@/components/SocialInbox";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inbox" element={<SocialInbox />} />
              {/* Redirect routes for specific inbox types */}
              <Route path="/inbox/email" element={<Navigate to="/inbox?tab=email" replace />} />
              <Route path="/inbox/linkedin" element={<Navigate to="/inbox?tab=linkedin" replace />} />
              <Route path="/inbox/twitter" element={<Navigate to="/inbox?tab=twitter" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
