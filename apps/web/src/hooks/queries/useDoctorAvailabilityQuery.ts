import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchDoctorAvailability = async (doctorId: string) => {
  const { data } = await api.get(`/doctors/${doctorId}/availability`);
  return data;
};

export const useDoctorAvailabilityQuery = (doctorId: string) => {
  return useQuery({
    queryKey: ['doctorAvailability', doctorId],
    queryFn: () => fetchDoctorAvailability(doctorId),
    enabled: !!doctorId,
  });
};
