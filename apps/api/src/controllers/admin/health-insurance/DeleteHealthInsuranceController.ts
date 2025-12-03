import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export class DeleteHealthInsuranceController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);

    const healthInsurance = await db.healthInsurance.findUnique({
      where: { id },
    });

    if (!healthInsurance) {
      return reply.status(404).send({ error: 'Health insurance not found.' });
    }

    await db.healthInsurance.delete({ where: { id } });

    return reply.status(204).send();
  }
}
