import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';

import { GymSearchGymsUseCase } from './search-gyms';

interface DataType {
  id?: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

let gymsRepository: InMemoryGymsRepository;
let sut: GymSearchGymsUseCase;

async function makeGyms(quantity: number, gymTitle?: string) {
  const stubGyms = await Promise.all(
    Array(quantity)
      .fill(null)
      .map((_, index) => {
        const internData: DataType = {
          title: faker.company.name(),
          description: faker.lorem.words(10),
          phone: faker.phone.number(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        };

        return gymsRepository.create({
          ...internData,
          title: gymTitle ? `${gymTitle} ${index}` : internData.title,
        });
      }),
  );

  return { stubGyms };
}

describe('🛠️  [USE CASES]: search for gyms', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new GymSearchGymsUseCase(gymsRepository);
  });

  it('should be able to search gym by title', async () => {
    const { stubGyms } = await makeGyms(22);

    const { gyms } = await sut.execute({
      query: stubGyms[0].title,
    });

    expect(gyms).toContain(stubGyms[0]);
  });

  it('should be able to fetch paginated gym search', async () => {
    const queryTitle = faker.company.name();
    const { stubGyms } = await makeGyms(22, queryTitle);

    const { gyms } = await sut.execute({
      query: queryTitle,
      page: 2,
    });

    const gym21 = stubGyms[20];
    const gym22 = stubGyms[21];

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([gym21, gym22]);
  });
});
