import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  crm: z.string().optional(),
  specialty: z.string().optional(),
});

export class UpdateDoctorController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const doctor = await db.doctor.findUnique({ where: { userId: id } });

    if (!doctor) {
      return reply.status(404).send({ error: 'Doctor not found.' });
    }
    
    if (data.crm) {
      const doctorByCrm = await db.doctor.findFirst({ where: { crm: data.crm, AND: { userId: { not: id}} }})
      if(doctorByCrm) {
        return reply.status(409).send({ error: 'This CRM is already in use.' });
      }
    }

    await db.doctor.update({
      where: { userId: id },
      data,
    });

    return reply.status(204).send();
  }
}
