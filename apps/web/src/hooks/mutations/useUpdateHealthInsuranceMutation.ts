import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const updateHealthInsurance = async ({ id, ...healthInsuranceData }: any) => {
  const { data } = await api.put(`/admin/health-insurances/${id}`, healthInsuranceData);
  return data;
};

export const useUpdateHealthInsuranceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHealthInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthInsurances'] });
    },
  });
};
