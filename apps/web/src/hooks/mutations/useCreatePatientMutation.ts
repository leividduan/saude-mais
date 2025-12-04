import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const createPatient = async (patientData: any) => {
  const { data } = await api.post('/admin/patients', patientData);
  return data;
};

export const useCreatePatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
