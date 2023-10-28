import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryGymsRepository } from '@repositories/in-memory/gyms-repository';

import { GymCreateGymUseCase } from './create-gym';

interface DataType {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

let gymsrepository: InMemoryGymsRepository;
let sut: GymCreateGymUseCase;
let data: DataType;

describe('🛠️  [USE CASES]: create gym', async () => {
  beforeEach(async () => {
    gymsrepository = new InMemoryGymsRepository();
    sut = new GymCreateGymUseCase(gymsrepository);
    data = {
      title: faker.person.fullName(),
      description: faker.lorem.words(10),
      phone: faker.phone.number(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
  });

  it('should be able to authenticate an user', async () => {
    const { gym } = await sut.execute(data);

    expect(gym.title).toEqual(data.title);
  });
});
