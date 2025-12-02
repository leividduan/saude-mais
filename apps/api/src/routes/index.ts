import { FastifyPluginAsync } from 'fastify';
import { authRoutes } from './auth';
import { authenticationMiddleare } from '../middlewares/authenticationMiddleware';

const publicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: '/auth' });
};

const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticationMiddleare);

};

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(publicRoutes);
  fastify.register(privateRoutes);
};
