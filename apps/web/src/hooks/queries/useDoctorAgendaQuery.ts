import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface Appointment {
  id: string;
  startTime: string;
  status: string;
  patient: {
    name: string;
  };
}

const fetchDoctorAgenda = async (): Promise<Appointment[]> => {
  const { data } = await api.get('/doctors/me/agenda');
  return data;
};

export const useDoctorAgendaQuery = () => {
  return useQuery({
    queryKey: ['doctor-agenda'],
    queryFn: fetchDoctorAgenda,
  });
};
