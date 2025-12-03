import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const schema = z.object({
  userId: z.string().uuid(),
  cpf: z.string(),
  phone: z.string().optional(),
  healthInsuranceId: z.string().uuid().optional(),
});

export class CreatePatientController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { userId, cpf, phone, healthInsuranceId } = schema.parse(request.body);

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    if (user.patient) {
      return reply.status(409).send({ error: 'This user already has a patient profile.' });
    }

    if (healthInsuranceId) {
      const healthInsurance = await db.healthInsurance.findUnique({
        where: { id: healthInsuranceId },
      });
      if (!healthInsurance) {
        return reply.status(404).send({ error: 'Health insurance not found.' });
      }
    }
    
    const patientByCpf = await db.patient.findUnique({ where: { cpf }})

    if(patientByCpf) {
      return reply.status(409).send({ error: 'This CPF is already in use.' });
    }

    const patient = await db.patient.create({
      data: {
        userId,
        cpf,
        phone,
        healthInsuranceId,
      },
    });

    return reply.status(201).send({ id: patient.userId });
  }
}
