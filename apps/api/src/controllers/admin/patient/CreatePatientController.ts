import { FastifyReply, FastifyRequest } from 'fastify';

export class CreatePatientController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(201).send({ message: 'Criar um novo paciente' });
  }
}
