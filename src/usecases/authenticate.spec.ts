import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@repositories/in-memory/users-repository';

import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentiasError } from './errors/invalid-credentials-error';

interface DataType {
  email: string;
  name: string;
  password_hash: string;
}

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
let password: string;
let data: DataType;

describe('🛠️  [USE CASES]: user authenticate', async () => {
  beforeEach(async () => {
    password = faker.internet.password({ length: 6 });
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
    data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash(password, 6),
    };
  });

  it('should be able to authenticate an user', async () => {
    await usersRepository.create(data);

    const { user } = await sut.execute({ email: data.email, password });

    expect(user.email).toEqual(data.email);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({ email: data.email, password }),
    ).rejects.toBeInstanceOf(InvalidCredentiasError);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create(data);

    await expect(() =>
      sut.execute({
        email: data.email,
        password: faker.internet.password({ length: 6 }),
      }),
    ).rejects.toBeInstanceOf(InvalidCredentiasError);
  });
});
