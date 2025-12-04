import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchPatients = async () => {
  const { data } = await api.get('/admin/patients');
  return data;
};

export const usePatientsQuery = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });
};
