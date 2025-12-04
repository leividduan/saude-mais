import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../lib/db';

export class ListDoctorsController {
  static async handler(_request: FastifyRequest, reply: FastifyReply) {
    const doctors = await db.doctor.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.userId,
      name: doctor.user.name,
      crm: doctor.crm,
      specialty: doctor.specialty,
    }));

    return reply.status(200).send(formattedDoctors);
  }
}
