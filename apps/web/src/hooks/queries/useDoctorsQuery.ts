import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchDoctors = async () => {
  const { data } = await api.get('/doctors');
  return data;
};

export const useDoctorsQuery = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });
};
