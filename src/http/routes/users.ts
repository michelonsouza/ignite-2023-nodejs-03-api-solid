import { FastifyInstance } from 'fastify';

import { register } from '@http/controllers/users';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);
}
