import { FastifyReply, FastifyRequest } from 'fastify';

export class BlockScheduleController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(201).send({ message: 'Bloquear Horários na Agenda' });
  }
}
