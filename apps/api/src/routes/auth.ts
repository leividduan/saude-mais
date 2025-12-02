import { FastifyPluginAsync } from 'fastify';
import { SignInController } from '../controllers/auth/SignInController';
import { SignUpController } from '../controllers/auth/SignUpController';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/signup', SignUpController.handler);
  fastify.post('/signin', SignInController.handler);
};
