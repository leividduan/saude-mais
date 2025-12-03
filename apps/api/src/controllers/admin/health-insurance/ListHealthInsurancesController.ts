import { FastifyReply, FastifyRequest } from 'fastify';

export class ListHealthInsurancesController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Listar todos os convênios' });
  }
}
