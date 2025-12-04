import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

const MinhasConsultas = () => {
  const mockAppointments = [
    {
      id: "1",
      doctor: "Dr. Carlos Silva",
      specialty: "Cardiologia",
      date: "15/12/2024",
      time: "09:00",
      status: "Agendada" as const,
    },
    {
      id: "2",
      doctor: "Dr. João Oliveira",
      specialty: "Dermatologia",
      date: "20/12/2024",
      time: "14:00",
      status: "Agendada" as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "bg-success text-success-foreground";
      case "Cancelada":
        return "bg-destructive text-destructive-foreground";
      case "Realizada":
        return "bg-muted text-muted-foreground";
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Minhas Consultas</h1>
              <p className="text-muted-foreground">
                Veja e gerencie suas consultas agendadas
              </p>
            </div>

            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id} className="shadow-card hover:shadow-card-hover transition-all-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{appointment.doctor}</CardTitle>
                        <p className="text-muted-foreground">{appointment.specialty}</p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                      <Button variant="destructive" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockAppointments.length === 0 && (
                <Card className="shadow-card">
                  <CardContent className="py-12 text-center">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhuma consulta agendada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Você ainda não tem consultas agendadas
                    </p>
                    <Button>Agendar Consulta</Button>
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

export default MinhasConsultas;
