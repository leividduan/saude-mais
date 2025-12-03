import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../../lib/db';

export class ListHealthInsurancesController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const healthInsurances = await db.healthInsurance.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return reply.send(healthInsurances);
  }
}
