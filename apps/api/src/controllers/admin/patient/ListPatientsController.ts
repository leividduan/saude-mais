import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../../lib/db';

export class ListPatientsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const patients = await db.patient.findMany({
      select: {
        userId: true,
        cpf: true,
        phone: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        healthInsurance: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        }
      }
    });

    const formattedPatients = patients.map((p) => ({
      id: p.userId,
      name: p.user.name,
      email: p.user.email,
      cpf: p.cpf,
      phone: p.phone,
      healthInsurance: p.healthInsurance?.name ?? null,
    }));

    return reply.send(formattedPatients);
  }
}
