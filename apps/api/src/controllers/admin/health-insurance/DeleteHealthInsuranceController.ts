import { FastifyReply, FastifyRequest } from 'fastify';

export class DeleteHealthInsuranceController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(204).send();
  }
}
