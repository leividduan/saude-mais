import { FastifyReply, FastifyRequest } from 'fastify';

export class UpdatePatientController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Atualizar um paciente' });
  }
}
