import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export class CancelAppointmentController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);
    const patientId = request.user.sub;

    const appointment = await db.appointment.findUnique({
      where: {
        id,
        patientId,
      },
    });

    if (!appointment) {
      return reply.status(404).send({ error: 'Appointment not found.' });
    }

    if (appointment.status === 'CANCELED') {
      return reply.status(409).send({ error: 'Appointment is already canceled.' });
    }

    await db.appointment.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELED',
      },
    });

    return reply.status(204).send();
  }
}
