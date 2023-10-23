import { FastifyInstance } from 'fastify';

import { userRoutes } from './users';

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes);
}
