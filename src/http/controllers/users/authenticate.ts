import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { PrismaUsersRepository } from '@repositories/prisma/users-repository';
import { AuthenticateUseCase } from '@usecases/authenticate';
import { ErrorWithStatusCode } from '@usecases/errors/error-with-status-code';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof ErrorWithStatusCode) {
      return reply.status(error.code).send({
        statusCode: error.code,
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(200).send();
}
