import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export class DeletePatientController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);

    const patient = await db.patient.findUnique({ where: { userId: id } });

    if (!patient) {
      return reply.status(404).send({ error: 'Patient not found.' });
    }

    await db.patient.delete({ where: { userId: id } });

    return reply.status(204).send();
  }
}
