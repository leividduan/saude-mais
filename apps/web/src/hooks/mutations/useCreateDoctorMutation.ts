import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const createDoctor = async (doctorData: any) => {
  const { data } = await api.post('/admin/doctors', doctorData);
  return data;
};

export const useCreateDoctorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDoctors'] });
    },
  });
};
