import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  name: z.string().optional(),
});

export class UpdateHealthInsuranceController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);
    const { name } = bodySchema.parse(request.body);

    const healthInsurance = await db.healthInsurance.findUnique({
      where: { id },
    });

    if (!healthInsurance) {
      return reply.status(404).send({ error: 'Health insurance not found.' });
    }

    if (name) {
      const existing = await db.healthInsurance.findFirst({
        where: { name, AND: { id: { not: id } } },
      });
      if (existing) {
        return reply.status(409).send({ error: 'Health insurance with this name already exists.' });
      }
    }

    await db.healthInsurance.update({
      where: { id },
      data: { name },
    });

    return reply.status(204).send();
  }
}
