import { FastifyReply, FastifyRequest } from 'fastify';

export class ListPatientsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Listar todos os pacientes' });
  }
}
