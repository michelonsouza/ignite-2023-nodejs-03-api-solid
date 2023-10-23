import { hash } from 'bcryptjs';

import { UsersRepository } from '@repositories/users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface ExecuteParams {
  name: string;
  email: string;
  password: string;
}

export class UserRegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ email, name, password }: ExecuteParams) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
