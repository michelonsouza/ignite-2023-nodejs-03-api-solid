import { PrismaUsersRepository } from '@/repositories/prisma/users-repository';

import { UserRegisterUseCase } from '../user-register';

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new UserRegisterUseCase(usersRepository);

  return registerUseCase;
}
