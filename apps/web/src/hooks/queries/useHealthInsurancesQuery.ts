import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchHealthInsurances = async () => {
  const { data } = await api.get('/admin/health-insurances');
  return data;
};

export const useHealthInsurancesQuery = () => {
  return useQuery({
    queryKey: ['healthInsurances'],
    queryFn: fetchHealthInsurances,
  });
};
