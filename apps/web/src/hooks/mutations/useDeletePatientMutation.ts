import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const deletePatient = async (id: string) => {
  const { data } = await api.delete(`/admin/patients/${id}`);
  return data;
};

export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
