import 'fastify';
import { OrganizationRole } from '../../generated/prisma/enums';

declare module 'fastify' {
  interface FastifyRequest {
    organizationUser: {
      userId: string;
      organizationId: string;
      role: OrganizationRole;
    };
  }
}
