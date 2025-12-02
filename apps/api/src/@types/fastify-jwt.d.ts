import '@fastify/jwt';

declare module '@fastify/jwt' {
  type Payload = {
    sub: string;
  };

  interface FastifyJWT {
    payload: Payload;
    user: Payload;
  }
}
