import { FastifyReply, FastifyRequest } from 'fastify';

export class CreateAppointmentController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(201).send({ message: 'Agendar Consulta' });
  }
}
