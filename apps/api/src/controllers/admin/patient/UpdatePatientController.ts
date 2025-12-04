/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  name: z.string().optional(),
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
    const { name, ...patientData } = bodySchema.parse(request.body);

    const patient = await db.patient.findUnique({ where: { userId: id } });

    if (!patient) {
      return reply.status(404).send({ error: 'Patient not found.' });
    }

    if (patientData.cpf) {
      const patientByCpf = await db.patient.findFirst({ where: { cpf: patientData.cpf, AND: { userId: { not: id } } } });
      if (patientByCpf) {
        return reply.status(409).send({ error: 'This CPF is already in use.' });
      }
    }

    if (patientData.healthInsuranceId) {
      const healthInsurance = await db.healthInsurance.findUnique({
        where: { id: patientData.healthInsuranceId },
      });
      if (!healthInsurance) {
        return reply.status(404).send({ error: 'Health insurance not found.' });
      }
    }

    // Remove propriedades undefined do patientData (mantém null)
    const cleanPatientData = Object.fromEntries(
      Object.entries(patientData).filter(([_, value]) => value !== undefined)
    );

    // Atualiza em transação para garantir consistência
    const updates: any[] = [];

    // Atualiza o nome do usuário, se fornecido
    if (name) {
      updates.push(db.user.update({
        where: { id },
        data: { name },
      }));
    }

    // Atualiza os dados do paciente se houver algo para atualizar
    if (Object.keys(cleanPatientData).length > 0) {
      updates.push(db.patient.update({
        where: { userId: id },
        data: cleanPatientData,
      }));
    }

    if (updates.length > 0) {
      await db.$transaction(updates);
    }

    return reply.status(204).send();
  }
}
