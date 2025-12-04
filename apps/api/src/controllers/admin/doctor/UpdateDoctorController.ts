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
  crm: z.string().optional(),
  specialty: z.string().optional(),
});

export class UpdateDoctorController {
  static async handler(
    request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = paramsSchema.parse(request.params);
    const { name, ...doctorData } = bodySchema.parse(request.body);

    const doctor = await db.doctor.findUnique({ where: { userId: id } });

    if (!doctor) {
      return reply.status(404).send({ error: 'Doctor not found.' });
    }

    if (doctorData.crm) {
      const doctorByCrm = await db.doctor.findFirst({ where: { crm: doctorData.crm, AND: { userId: { not: id } } } });
      if (doctorByCrm) {
        return reply.status(409).send({ error: 'This CRM is already in use.' });
      }
    }

    // Remove propriedades undefined do doctorData
    const cleanDoctorData = Object.fromEntries(
      Object.entries(doctorData).filter(([_, value]) => value !== undefined)
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

    // Atualiza os dados do médico se houver algo para atualizar
    if (Object.keys(cleanDoctorData).length > 0) {
      updates.push(db.doctor.update({
        where: { userId: id },
        data: cleanDoctorData,
      }));
    }

    if (updates.length > 0) {
      await db.$transaction(updates);
    }

    return reply.status(204).send();
  }
}
