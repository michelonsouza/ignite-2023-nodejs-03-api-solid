import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@repositories/in-memory/users-repository';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

interface DataType {
  email: string;
  name: string;
  password_hash: string;
}

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
let password: string;
let data: DataType;

describe('🛠️  [USE CASES]: get user profile', async () => {
  beforeEach(async () => {
    password = faker.internet.password({ length: 6 });
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
    data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash(password, 6),
    };
  });

  it('should be able to user profile by id', async () => {
    const { id } = await usersRepository.create(data);

    const { user } = await sut.execute({ userId: id });

    expect(user.id).toEqual(id);
    expect(user.name).toEqual(data.name);
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: faker.string.uuid() }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
