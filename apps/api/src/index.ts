import 'dotenv/config';
import Fastify from 'fastify';
import { routes } from './routes';
import { ZodError } from 'zod';
import fastifyJwt from '@fastify/jwt';

const fastify = Fastify();

fastify.register(routes);
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  sign: {
    expiresIn: '5h'
  }
});

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    reply.code(400).send({ errors: error.issues });
    return;
  }

  console.log(error);
  reply.code(500).send({ message: 'Internal server error' });
});

fastify
  .listen({ port: 3001 })
  .then(() => console.log('> Server listening on http://localhost:3001'));
