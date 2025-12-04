import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const createHealthInsurance = async (healthInsuranceData: any) => {
  const { data } = await api.post('/admin/health-insurances', healthInsuranceData);
  return data;
};

export const useCreateHealthInsuranceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHealthInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthInsurances'] });
    },
  });
};
