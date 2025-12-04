import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchAppointmentsByInsuranceReport = async ({
  healthInsuranceId,
  startDate,
  endDate,
}: any) => {
  const { data } = await api.get(
    '/admin/reports/appointments-by-insurance',
    {
      params: {
        healthInsuranceId,
        startDate,
        endDate,
      },
      responseType: 'blob',
    }
  );
  return data;
};

export const useAppointmentsByInsuranceReportQuery = ({
  healthInsuranceId,
  startDate,
  endDate,
}: any) => {
  return useQuery({
    queryKey: ['appointmentsByInsuranceReport', healthInsuranceId, startDate, endDate],
    queryFn: () =>
      fetchAppointmentsByInsuranceReport({
        healthInsuranceId,
        startDate,
        endDate,
      }),
    enabled: false,
  });
};
