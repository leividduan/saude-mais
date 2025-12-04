import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../../../lib/db';

const schema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  cpf: z.string(),
  phone: z.string().optional(),
  healthInsuranceId: z.string().uuid().optional(),
}).refine(
  (data) => {
    // Se userId não for fornecido, name, email e password são obrigatórios
    if (!data.userId) {
      return data.name && data.email && data.password;
    }
    return true;
  },
  {
    message: 'When userId is not provided, name, email and password are required',
  }
);

export class CreatePatientController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { userId, name, email, password, cpf, phone, healthInsuranceId } = schema.parse(request.body);

    // Verifica se CPF já está em uso
    const patientByCpf = await db.patient.findUnique({ where: { cpf } });
    if (patientByCpf) {
      return reply.status(409).send({ error: 'This CPF is already in use.' });
    }

    let finalUserId = userId;

    // Se userId não foi fornecido, criar novo usuário
    if (!userId) {
      // Verifica se email já está em uso
      const existingUser = await db.user.findUnique({ where: { email: email! } });
      if (existingUser) {
        return reply.status(409).send({ error: 'Email is already in use.' });
      }

      // Cria hash da senha
      const hashedPassword = await bcrypt.hash(password!, 10);

      // Cria o novo usuário
      const newUser = await db.user.create({
        data: {
          name: name!,
          email: email!,
          password: hashedPassword,
          role: 'PATIENT',
        },
      });

      finalUserId = newUser.id;
    } else {
      // Se userId foi fornecido, verifica se existe e não tem perfil de paciente
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

      // Atualiza o role do usuário para PATIENT
      await db.user.update({
        where: { id: userId },
        data: { role: 'PATIENT' },
      });
    }

    // Verifica se health insurance existe (se fornecido)
    if (healthInsuranceId) {
      const healthInsurance = await db.healthInsurance.findUnique({
        where: { id: healthInsuranceId },
      });
      if (!healthInsurance) {
        return reply.status(404).send({ error: 'Health insurance not found.' });
      }
    }

    // Cria o perfil de paciente
    const patient = await db.patient.create({
      data: {
        userId: finalUserId!,
        cpf,
        phone: phone || null,
        healthInsuranceId: healthInsuranceId || null,
      },
    });

    return reply.status(201).send({ id: patient.userId });
  }
}
