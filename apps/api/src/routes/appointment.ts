import { FastifyPluginAsync } from 'fastify';
import { CreateAppointmentController } from '../controllers/appointment/CreateAppointmentController';
import { CancelAppointmentController } from '../controllers/appointment/CancelAppointmentController';

export const appointmentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', CreateAppointmentController.handler);
  fastify.patch('/:id/cancel', CancelAppointmentController.handler);
};
