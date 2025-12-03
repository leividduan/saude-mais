import { FastifyReply, FastifyRequest } from 'fastify';

export class UpdateDoctorController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Atualizar um médico' });
  }
}
