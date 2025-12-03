import { FastifyReply, FastifyRequest } from 'fastify';

export class DeleteDoctorController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(204).send();
  }
}
