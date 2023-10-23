import { fakerPT_BR as faker } from '@faker-js/faker';
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '@repositories/in-memory/users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UserRegisterUseCase } from './user-register';

interface DataType {
  email: string;
  name: string;
  password: string;
}

let usersRepository: InMemoryUsersRepository;
let sut: UserRegisterUseCase;
let data: DataType;

describe('🛠️  [USE CASES]: user register', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UserRegisterUseCase(usersRepository);
    data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    };
  });

  it('should be able to register an user', async () => {
    const { user } = await sut.execute(data);

    expect(user.id).toBeTypeOf('string');
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute(data);

    const isPasswordCorrectlyHashed = await compare(
      data.password,
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    await sut.execute(data);

    const secondData = {
      ...data,
      name: faker.person.fullName(),
      password: faker.internet.email(),
    };

    await expect(() => sut.execute(secondData)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
  });
});
