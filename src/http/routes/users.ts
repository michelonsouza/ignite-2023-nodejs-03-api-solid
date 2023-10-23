import { FastifyInstance } from 'fastify';

import { register, authenticate } from '@http/controllers/users';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);
}
