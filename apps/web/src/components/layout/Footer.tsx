import { Stethoscope } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clínica Saúde+. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
