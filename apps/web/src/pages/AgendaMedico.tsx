import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BloqueioAgenda } from "@/components/medico/BloqueioAgenda";

const AgendaMedico = () => {
  const mockAppointments = [
    {
      id: "1",
      patient: "João da Silva",
      time: "09:00",
      status: "Confirmada" as const,
    },
    {
      id: "2",
      patient: "Maria Oliveira",
      time: "10:00",
      status: "Aguardando" as const,
    },
    {
      id: "3",
      patient: "José Santos",
      time: "11:00",
      status: "Cancelada" as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-success text-success-foreground";
      case "Aguardando":
        return "bg-yellow-500 text-white";
      case "Cancelada":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold">Minha Agenda</h1>
                <p className="text-muted-foreground">
                  Consutas para <strong>Hoje, 24 de Julho</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ToggleGroup type="single" defaultValue="day" variant="outline">
                  <ToggleGroupItem value="day">Dia</ToggleGroupItem>
                  <ToggleGroupItem value="week">Semana</ToggleGroupItem>
                </ToggleGroup>
                <BloqueioAgenda />
              </div>
            </div>

            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id} className="shadow-card hover:shadow-card-hover transition-all-smooth">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold text-lg">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{appointment.patient}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}

              {mockAppointments.length === 0 && (
                <Card className="shadow-card">
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhuma consulta para hoje
                    </h3>
                    <p className="text-muted-foreground">
                      Você não tem nenhuma consulta agendada para a data de hoje.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgendaMedico;
