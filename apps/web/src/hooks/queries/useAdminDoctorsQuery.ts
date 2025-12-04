import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchDoctors = async () => {
  const { data } = await api.get('/admin/doctors');
  return data;
};

export const useAdminDoctorsQuery = () => {
  return useQuery({
    queryKey: ['adminDoctors'],
    queryFn: fetchDoctors,
  });
};
