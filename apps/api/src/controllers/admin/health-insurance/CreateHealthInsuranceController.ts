import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const schema = z.object({
  name: z.string(),
});

export class CreateHealthInsuranceController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { name } = schema.parse(request.body);

    const existing = await db.healthInsurance.findFirst({ where: { name } });
    if (existing) {
      return reply.status(409).send({ error: 'Health insurance with this name already exists.' });
    }

    const healthInsurance = await db.healthInsurance.create({
      data: {
        name,
      },
    });

    return reply.status(201).send(healthInsurance);
  }
}
