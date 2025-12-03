import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const schema = z.object({
  userId: z.string().uuid(),
  crm: z.string(),
  specialty: z.string(),
});

export class CreateDoctorController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { userId, crm, specialty } = schema.parse(request.body);

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { doctor: true },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    if (user.doctor) {
      return reply.status(409).send({ error: 'This user already has a doctor profile.' });
    }

    const doctorByCrm = await db.doctor.findUnique({ where: { crm } });

    if (doctorByCrm) {
      return reply.status(409).send({ error: 'This CRM is already in use.' });
    }

    const [, doctor] = await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { role: 'DOCTOR' },
      }),
      db.doctor.create({
        data: {
          userId,
          crm,
          specialty,
        },
      }),
    ]);

    return reply.status(201).send({ id: doctor.userId });
  }
}
