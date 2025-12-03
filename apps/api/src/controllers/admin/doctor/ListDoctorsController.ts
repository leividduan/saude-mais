import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../../lib/db';

export class ListDoctorsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const doctors = await db.doctor.findMany({
      select: {
        userId: true,
        crm: true,
        specialty: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    const formattedDoctors = doctors.map((d) => ({
      id: d.userId,
      name: d.user.name,
      email: d.user.email,
      crm: d.crm,
      specialty: d.specialty,
    }));

    return reply.send(formattedDoctors);
  }
}
