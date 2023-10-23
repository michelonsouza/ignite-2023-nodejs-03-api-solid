import { compare } from 'bcryptjs';

import { User, UsersRepository } from '@repositories/users-repository';

import { InvalidCredentiasError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentiasError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentiasError();
    }

    return { user };
  }
}
