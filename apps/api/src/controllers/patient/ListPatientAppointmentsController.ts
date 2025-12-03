import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../lib/db';

export class ListPatientAppointmentsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    const appointments = await db.appointment.findMany({
      where: {
        patientId: userId,
      },
      select: {
        id: true,
        startTime: true,
        status: true,
        doctor: {
          select: {
            specialty: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      }
    });

    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      startTime: appointment.startTime,
      status: appointment.status,
      doctor: {
        name: appointment.doctor.user.name,
        specialty: appointment.doctor.specialty,
      },
    }));

    return reply.send(formattedAppointments);
  }
}
