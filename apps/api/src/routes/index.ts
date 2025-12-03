import { FastifyPluginAsync } from 'fastify';
import { authRoutes } from './auth';
import { authenticationMiddleare } from '../middlewares/authenticationMiddleware';
import { appointmentRoutes } from './appointment';
import { patientRoutes } from './patient';
import { doctorRoutes } from './doctor';
import { adminRoutes } from './admin';

const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: '/auth' });
};

const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticationMiddleare);

  fastify.register(appointmentRoutes, { prefix: '/appointments' });
  fastify.register(patientRoutes, { prefix: '/patients' });
  fastify.register(doctorRoutes, { prefix: '/doctors' });
  fastify.register(adminRoutes, { prefix: '/admin' });
};

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(publicRoutes);
  fastify.register(privateRoutes);
};
