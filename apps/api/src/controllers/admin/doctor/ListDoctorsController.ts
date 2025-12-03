import { FastifyReply, FastifyRequest } from 'fastify';

export class ListDoctorsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Listar todos os médicos' });
  }
}
