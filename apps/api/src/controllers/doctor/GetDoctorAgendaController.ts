import { FastifyReply, FastifyRequest } from 'fastify';

export class GetDoctorAgendaController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Visualizar Agenda do Médico' });
  }
}
