import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Clínica Saúde+</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/agendar"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Agendar
            </NavLink>
            <NavLink
              to="/minhas-consultas"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Minhas Consultas
            </NavLink>
            <NavLink
              to="/admin"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Administração
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            {user && <span className="hidden md:inline text-sm text-muted-foreground">{user.name}</span>}
            <Button variant="outline" onClick={logout}>Sair</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
