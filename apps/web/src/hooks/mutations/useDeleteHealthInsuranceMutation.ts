import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const deleteHealthInsurance = async (id: string) => {
  const { data } = await api.delete(`/admin/health-insurances/${id}`);
  return data;
};

export const useDeleteHealthInsuranceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHealthInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthInsurances'] });
    },
  });
};
