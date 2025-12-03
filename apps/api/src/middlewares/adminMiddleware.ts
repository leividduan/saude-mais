import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../lib/db';

export async function adminMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Forbidden: Admin access required.' });
  }
}
