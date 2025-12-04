import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, AlertTriangle } from "lucide-react";
import { api } from "@/services/dataService";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from '@tanstack/react-query';

interface Appointment {
  id: string;
  doctor: {
    user: {
      name: string;
    },
    specialty: string;
  };
  date: string;
  status: string;
}

const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get('/patient/appointments');
  return response.data;
};

const MinhasConsultas = () => {
  const { data: appointments, isLoading, isError, error } = useQuery<Appointment[], Error>({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-success text-success-foreground";
      case "CANCELED":
        return "bg-destructive text-destructive-foreground";
      case "COMPLETED":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      SCHEDULED: "Agendada",
      CANCELED: "Cancelada",
      COMPLETED: "Realizada",
    };
    return statusMap[status] || status;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
    };
  }

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
              {isLoading && (
                <>
                  <Card className="shadow-card">
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {isError && (
                 <Card>
                    <CardContent className="py-12 text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                      <h3 className="text-lg font-semibold mb-2 text-destructive">
                        Ocorreu um erro
                      </h3>
                      <p className="text-muted-foreground">
                        {error?.message || "Não foi possível carregar as consultas."}
                      </p>
                    </CardContent>
                 </Card>
              )}

              {!isLoading && !isError && appointments?.map((appointment) => {
                const { day, time } = formatDate(appointment.date);
                return (
                  <Card key={appointment.id} className="shadow-card hover:shadow-card-hover transition-all-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{appointment.doctor.user.name}</CardTitle>
                          <p className="text-muted-foreground">{appointment.doctor.specialty}</p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {formatStatus(appointment.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{day}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{time}</span>
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
                )
              })}

              {!isLoading && !isError && appointments?.length === 0 && (
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
