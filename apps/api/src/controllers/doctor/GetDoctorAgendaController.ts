import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../lib/db';

export class GetDoctorAgendaController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: userId,
      },
      select: {
        id: true,
        startTime: true,
        status: true,
        patient: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      startTime: appointment.startTime,
      status: appointment.status,
      patient: {
        name: appointment.patient.user.name,
      },
    }));

    return reply.send(formattedAppointments);
  }
}
