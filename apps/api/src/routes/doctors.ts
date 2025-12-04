import { FastifyPluginAsync } from 'fastify';
import { ListDoctorsController } from '../controllers/doctor/ListDoctorsController';
import { GetDoctorAvailabilityController } from '../controllers/doctor/GetDoctorAvailabilityController';

export const doctorsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', ListDoctorsController.handler);
  fastify.get('/:doctorId/availability', GetDoctorAvailabilityController.handler);
};
