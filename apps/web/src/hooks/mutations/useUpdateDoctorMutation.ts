import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const updateDoctor = async ({ id, ...doctorData }: any) => {
  const { data } = await api.put(`/admin/doctors/${id}`, doctorData);
  return data;
};

export const useUpdateDoctorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDoctors'] });
    },
  });
};
