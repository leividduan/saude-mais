import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const updatePatient = async ({ id, ...patientData }: any) => {
  const { data } = await api.put(`/admin/patients/${id}`, patientData);
  return data;
};

export const useUpdatePatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
