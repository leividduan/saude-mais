import { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticationMiddleare(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'Invalid access token.' });
  }
}
