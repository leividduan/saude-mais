import { Stethoscope } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Clínica Saúde+</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Cuidando da sua saúde com excelência e dedicação.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/agendar" className="hover:text-primary transition-colors">
                  Agendar Consulta
                </a>
              </li>
              <li>
                <a href="/minhas-consultas" className="hover:text-primary transition-colors">
                  Minhas Consultas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@clinicasaudemais.com.br</li>
              <li>(11) 3456-7890</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clínica Saúde+. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
