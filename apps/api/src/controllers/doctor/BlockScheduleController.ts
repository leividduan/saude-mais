import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../lib/db';

const schema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().optional(),
});

export class BlockScheduleController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { startTime, endTime, reason } = schema.parse(request.body);
    const doctorId = request.user.sub;

    const scheduleBlock = await db.scheduleBlock.create({
      data: {
        doctorId,
        startTime,
        endTime,
        reason: reason ?? '',
      },
    });

    return reply.status(201).send(scheduleBlock);
  }
}
