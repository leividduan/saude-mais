import { FastifyReply, FastifyRequest } from 'fastify';

export class ListPatientAppointmentsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Listar Minhas Consultas' });
  }
}
