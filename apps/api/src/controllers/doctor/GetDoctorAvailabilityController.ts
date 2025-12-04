import { FastifyReply, FastifyRequest } from 'fastify';

export class GetDoctorAvailabilityController {
  static async handler(
    request: FastifyRequest<{ Params: { doctorId: string } }>,
    reply: FastifyReply
  ) {
    // For now, returning a hardcoded list of time slots
    const availableTimeSlots = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    return reply.status(200).send(availableTimeSlots);
  }
}
