import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { ErrorWithStatusCode } from '@usecases/errors/error-with-status-code';
import { makeRegisterUseCase } from '@usecases/factories';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUserCase = makeRegisterUseCase();

    await registerUserCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof ErrorWithStatusCode) {
      return reply.status(error.code).send({
        statusCode: error.code,
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(201).send();
}
