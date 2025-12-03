import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export class DeleteDoctorController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);

    const doctor = await db.doctor.findUnique({ where: { userId: id } });

    if (!doctor) {
      return reply.status(404).send({ error: 'Doctor not found.' });
    }

    await db.$transaction([
      db.doctor.delete({ where: { userId: id } }),
      db.user.update({ where: { id }, data: { role: 'PATIENT' } }),
    ]);

    return reply.status(204).send();
  }
}
