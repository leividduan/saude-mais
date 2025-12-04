import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const createAppointment = async (appointmentData: any) => {
  const { data } = await api.post('/appointments', appointmentData);
  return data;
};

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
