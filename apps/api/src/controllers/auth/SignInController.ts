import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { db } from '../../lib/db';
import { compare } from 'bcryptjs';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = schema.parse(request.body);

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
        name: true,
        email: true,
      },
    });

    if (!user || !(await compare(password, user.password))) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const accessToken = request.server.jwt.sign({
      sub: user.id,
    });

    return reply.status(201).send({ accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
}
