import { FastifyReply, FastifyRequest } from 'fastify';

export class AppointmentsByInsuranceController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    reply.header('Content-Type', 'application/pdf');
    return reply.send({ message: 'Relatório de Consultas por Convênio' });
  }
}
