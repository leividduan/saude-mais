import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  cpf: z.string().optional(),
  phone: z.string().optional(),
  healthInsuranceId: z.string().uuid().optional().nullable(),
});

export class UpdatePatientController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const patient = await db.patient.findUnique({ where: { userId: id } });

    if (!patient) {
      return reply.status(404).send({ error: 'Patient not found.' });
    }
    
    if(data.cpf) {
      const patientByCpf = await db.patient.findFirst({ where: { cpf: data.cpf, AND: { userId: { not: id}} }})
      if(patientByCpf) {
        return reply.status(409).send({ error: 'This CPF is already in use.' });
      }
    }

    if (data.healthInsuranceId) {
      const healthInsurance = await db.healthInsurance.findUnique({
        where: { id: data.healthInsuranceId },
      });
      if (!healthInsurance) {
        return reply.status(404).send({ error: 'Health insurance not found.' });
      }
    }

    await db.patient.update({
      where: { userId: id },
      data,
    });

    return reply.status(204).send();
  }
}
