import { FastifyPluginAsync } from 'fastify';
import { ListPatientAppointmentsController } from '../controllers/patient/ListPatientAppointmentsController';

export const patientRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/me/appointments', ListPatientAppointmentsController.handler);
};
