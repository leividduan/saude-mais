import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SpecialtyCard } from './SpecialtyCard';
import { DoctorCard } from './DoctorCard';
import { Check, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { specialties } from '@/data/specialties';

type Step = 1 | 2 | 3 | 4;

interface AppointmentData {
  specialty: string;
  doctor: any;
  date: string;
  time: string;
}

export const AppointmentWizard = () => {
  const [step, setStep] = useState<Step>(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    specialty: '',
    doctor: null,
    date: '',
    time: '',
  });
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (error) {
        toast({
          title: 'Erro ao buscar médicos',
          description: 'Não foi possível carregar a lista de médicos.',
        });
      }
    };
    fetchDoctors();
  }, [toast]);

  useEffect(() => {
    const getDates = () => {
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          dayNumber: date.getDate(),
        });
      }
      setAvailableDates(dates);
    };
    getDates();
  }, []);

  useEffect(() => {
    if (appointmentData.doctor) {
      const fetchAvailability = async () => {
        try {
          const response = await api.get(
            `/doctors/${appointmentData.doctor.id}/availability`
          );
          setAvailableTimeSlots(response.data);
        } catch (error) {
          toast({
            title: 'Erro ao buscar horários',
            description: 'Não foi possível carregar os horários do médico.',
          });
        }
      };
      fetchAvailability();
    }
  }, [appointmentData.doctor, toast]);

  const progressValue = (step / 4) * 100;
  const filteredDoctors = doctors.filter(
    (d) => d.specialty === appointmentData.specialty
  );

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleConfirm = async () => {
    try {
      const { doctor, date, time } = appointmentData;
      const [hour, minute] = time.split(':');
      const startTime = new Date(date);
      startTime.setHours(parseInt(hour, 10), parseInt(minute, 10));

      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      await api.post('/appointments', {
        doctorId: doctor.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      toast({
        title: 'Consulta Agendada! ✓',
        description: 'Seu agendamento foi confirmado com sucesso.',
      });
      // Reset wizard
      setStep(1);
      setAppointmentData({
        specialty: '',
        doctor: null,
        date: '',
        time: '',
      });
    } catch (error) {
      toast({
        title: 'Erro ao agendar consulta',
        description:
          'Não foi possível agendar sua consulta. Tente novamente.',
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return appointmentData.specialty !== '';
      case 2:
        return appointmentData.doctor !== null;
      case 3:
        return appointmentData.date !== '' && appointmentData.time !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const selectedSpecialty = specialties.find(
    (s) => s.id === appointmentData.specialty
  );
  const selectedDate = availableDates.find(
    (d) => d.date === appointmentData.date
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-card">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Agendar Consulta</CardTitle>
              <span className="text-sm text-muted-foreground">
                Etapa {step} de 4
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Select Specialty */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Escolha a Especialidade
                </h2>
                <p className="text-muted-foreground">
                  Selecione a especialidade médica que você precisa
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {specialties.map((specialty) => (
                  <SpecialtyCard
                    key={specialty.id}
                    name={specialty.name}
                    icon={specialty.icon}
                    selected={appointmentData.specialty === specialty.id}
                    onClick={() =>
                      setAppointmentData({
                        ...appointmentData,
                        specialty: specialty.id,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Escolha o Médico
                </h2>
                <p className="text-muted-foreground">
                  Selecione o profissional de sua preferência
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    selected={appointmentData.doctor?.id === doctor.id}
                    onClick={() =>
                      setAppointmentData({ ...appointmentData, doctor })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Data e Horário</h2>
                <p className="text-muted-foreground">
                  Escolha o melhor dia e horário para sua consulta
                </p>
              </div>

              {/* Date Selection */}
              <div>
                <h3 className="font-medium mb-3">Selecione a Data</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableDates.map((dateInfo) => (
                    <Button
                      key={dateInfo.date}
                      variant={
                        appointmentData.date === dateInfo.date
                          ? 'default'
                          : 'outline'
                      }
                      className="flex-shrink-0 flex flex-col h-auto py-3 px-4"
                      onClick={() =>
                        setAppointmentData({
                          ...appointmentData,
                          date: dateInfo.date,
                        })
                      }
                    >
                      <span className="text-xs">{dateInfo.dayName}</span>
                      <span className="text-lg font-bold">
                        {dateInfo.dayNumber}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {appointmentData.date && (
                <div>
                  <h3 className="font-medium mb-3">Selecione o Horário</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {availableTimeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={
                          appointmentData.time === time ? 'default' : 'outline'
                        }
                        onClick={() =>
                          setAppointmentData({ ...appointmentData, time })
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Confirme seu Agendamento
                </h2>
                <p className="text-muted-foreground">
                  Revise os dados antes de confirmar
                </p>
              </div>

              <Card className="bg-accent border-2 border-primary">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Médico</p>
                      <p className="font-semibold">
                        {appointmentData.doctor?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Especialidade
                      </p>
                      <p className="font-semibold">{selectedSpecialty?.name}</p>
.                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-semibold">
                        {selectedDate?.dayName}, {selectedDate?.dayNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-semibold">{appointmentData.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>

            {step < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleConfirm}>Confirmar Agendamento</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
