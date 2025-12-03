import { FastifyReply, FastifyRequest } from 'fastify';

export class UpdateHealthInsuranceController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Atualizar um convênio' });
  }
}
