import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Agendar from "./pages/Agendar";
import MinhasConsultas from "./pages/MinhasConsultas";
import Admin from "./pages/Admin";
import AgendaMedico from "./pages/AgendaMedico";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
      <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AuthGuard isPrivate={false} />}>
              <Route path="/" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<AuthGuard isPrivate />}>
              <Route path="/agendar" element={<ProtectedRoute roles={['patient']}><Agendar /></ProtectedRoute>} />
              <Route path="/minhas-consultas" element={<ProtectedRoute roles={['patient']}><MinhasConsultas /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
              <Route path="/agenda-medico" element={<ProtectedRoute roles={['doctor']}><AgendaMedico /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
