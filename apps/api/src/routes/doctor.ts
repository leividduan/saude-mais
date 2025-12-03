import { FastifyPluginAsync } from 'fastify';
import { GetDoctorAgendaController } from '../controllers/doctor/GetDoctorAgendaController';
import { BlockScheduleController } from '../controllers/doctor/BlockScheduleController';

export const doctorRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/me/agenda', GetDoctorAgendaController.handler);
  fastify.post('/me/schedule-blocks', BlockScheduleController.handler);
};
