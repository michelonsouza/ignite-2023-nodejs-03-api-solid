import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';

import { GymFetchNearbyGymsUseCase } from './fetch-nearby-gyms';

interface DataType {
  id?: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface LocationParamType {
  latitude: number;
  longitude: number;
}

let gymsRepository: InMemoryGymsRepository;
let sut: GymFetchNearbyGymsUseCase;

async function makeGyms(
  quantity: number,
  { latitude, longitude }: LocationParamType = {} as LocationParamType,
) {
  const stubGyms = await Promise.all(
    Array(quantity)
      .fill(null)
      .map((_, index) => {
        const internData: DataType = {
          title: `${faker.company.name()} - ${index}`,
          description: faker.lorem.words(10),
          phone: faker.phone.number(),
          latitude: latitude || faker.location.latitude(),
          longitude: longitude || faker.location.longitude(),
        };

        return gymsRepository.create({
          ...internData,
        });
      }),
  );

  return { stubGyms };
}

describe('🛠️  [USE CASES]: fetch nearby gyms', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new GymFetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    const userLocation = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
    const { stubGyms } = await makeGyms(
      faker.number.int({ min: 1, max: 20 }),
      userLocation,
    );

    const { gyms } = await sut.execute({
      userLatitude: userLocation.latitude,
      userLongitude: userLocation.longitude,
    });

    expect(gyms).toHaveLength(stubGyms.length);
  });

  it('should be able to fetch only nearby gyms', async () => {
    const gymsLocation = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
    const userLocation = {
      latitude: faker.location.latitude() + 2,
      longitude: faker.location.longitude() + 2,
    };

    await makeGyms(faker.number.int({ min: 1, max: 20 }), gymsLocation);

    const { gyms } = await sut.execute({
      userLatitude: userLocation.latitude,
      userLongitude: userLocation.longitude,
    });

    expect(gyms).toHaveLength(0);
  });

  it('should be able to fetch paginated nearby gyms', async () => {
    const userLocation = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
    const { stubGyms } = await makeGyms(22, userLocation);
    const gym21 = stubGyms[20];
    const gym22 = stubGyms[21];

    const { gyms } = await sut.execute({
      userLatitude: userLocation.latitude,
      userLongitude: userLocation.longitude,
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([gym21, gym22]);
  });
});
