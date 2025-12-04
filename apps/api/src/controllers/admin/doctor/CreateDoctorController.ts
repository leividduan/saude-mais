import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';

const schema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  crm: z.string(),
  specialty: z.string(),
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

export class CreateDoctorController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { userId, name, email, password, crm, specialty } = schema.parse(request.body);

    // Verifica se CRM já está em uso
    const doctorByCrm = await db.doctor.findUnique({ where: { crm } });
    if (doctorByCrm) {
      return reply.status(409).send({ error: 'This CRM is already in use.' });
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
          role: 'DOCTOR',
        },
      });

      finalUserId = newUser.id;
    } else {
      // Se userId foi fornecido, verifica se existe e não tem perfil de médico
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { doctor: true },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found.' });
      }

      if (user.doctor) {
        return reply.status(409).send({ error: 'This user already has a doctor profile.' });
      }

      // Atualiza o role do usuário para DOCTOR
      await db.user.update({
        where: { id: userId },
        data: { role: 'DOCTOR' },
      });
    }

    // Cria o perfil de médico
    const doctor = await db.doctor.create({
      data: {
        userId: finalUserId!,
        crm,
        specialty,
      },
    });

    return reply.status(201).send({ id: doctor.userId });
  }
}
