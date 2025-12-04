import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const deleteDoctor = async (id: string) => {
  const { data } = await api.delete(`/admin/doctors/${id}`);
  return data;
};

export const useDeleteDoctorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDoctors'] });
    },
  });
};
