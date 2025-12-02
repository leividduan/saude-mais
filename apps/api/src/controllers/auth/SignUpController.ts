import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../lib/db';
import { hash } from 'bcryptjs';

const schema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export class SignUpController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const user = schema.parse(request.body);

    const userAlreadyExists = await db.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (userAlreadyExists) {
      return reply.status(409).send({ error: 'This email is already in use' });
    }

    const hashedPassword = await hash(user.password, 12);

    const { id } = await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      }
    });

    return reply.status(201).send({ id });
  }
}
