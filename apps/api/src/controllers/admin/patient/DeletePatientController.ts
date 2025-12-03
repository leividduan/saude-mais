import { FastifyReply, FastifyRequest } from 'fastify';

export class DeletePatientController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(204).send();
  }
}
