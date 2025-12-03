import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../lib/db';

const schema = z.object({
  doctorId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export class CreateAppointmentController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { doctorId, startTime, endTime } = schema.parse(request.body);
    const patientId = request.user.sub;

    const doctor = await db.doctor.findUnique({
      where: { userId: doctorId },
    });

    if (!doctor) {
      return reply.status(404).send({ error: 'Doctor not found' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check for conflicting appointments
    const conflictingAppointment = await db.appointment.findFirst({
      where: {
        doctorId,
        status: { not: 'CANCELED' },
        OR: [
          {
            startTime: {
              lt: end,
              gte: start,
            },
          },
          {
            endTime: {
              gt: start,
              lte: end,
            },
          },
        ],
      },
    });

    if (conflictingAppointment) {
      return reply.status(409).send({ error: 'This time slot is already booked.' });
    }

    // Check for conflicting schedule blocks
    const conflictingBlock = await db.scheduleBlock.findFirst({
      where: {
        doctorId,
        OR: [
          {
            startTime: {
              lt: end,
              gte: start,
            },
          },
          {
            endTime: {
              gt: start,
              lte: end,
            },
          },
        ],
      },
    });

    if (conflictingBlock) {
      return reply.status(409).send({ error: 'The doctor is not available at this time.' });
    }

    const appointment = await db.appointment.create({
      data: {
        doctorId,
        patientId,
        startTime: start,
        endTime: end,
      },
      select: {
        id: true,
        status: true,
        startTime: true,
        doctorId: true,
        patientId: true,
      }
    });

    return reply.status(201).send(appointment);
  }
}
