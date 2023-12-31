import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { InMemoryCheckInsRepository } from '@repositories/in-memory/check-ins-repository';

import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max.number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DataType {
  user_id: string;
  gym_id: string;
  validated_at?: string | Date | null;
  userLatitude: number;
  userLongitude: number;
}

interface GymDataType {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

let gymsRepository: InMemoryGymsRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;
let data: DataType;
let gymData: GymDataType;

describe('🛠️  [USE CASES]: check-ins', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);
    data = {
      user_id: faker.string.uuid(),
      gym_id: faker.string.uuid(),
      validated_at: null,
      userLatitude: faker.location.latitude(),
      userLongitude: faker.location.longitude(),
    };

    gymData = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(1),
      phone: faker.phone.number(),
    };

    vi.useFakeTimers({
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2023, 9, 26, 8, 0, 0));

    const gym = await gymsRepository.create(gymData);

    const { checkIn } = await sut.execute({
      userId: data.user_id,
      gymId: gym.id,
      userLatitude: gymData.latitude,
      userLongitude: gymData.longitude,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2023-10-26T08:00:00.000z'));
    const gym2Data = { ...gymData, id: faker.string.uuid() };

    const gym1 = await gymsRepository.create(gymData);
    const gym2 = await gymsRepository.create(gym2Data);

    await sut.execute({
      userId: data.user_id,
      gymId: gym1.id,
      userLatitude: gymData.latitude,
      userLongitude: gymData.longitude,
    });

    await expect(() =>
      sut.execute({
        userId: data.user_id,
        gymId: gym2.id,
        userLatitude: gymData.latitude,
        userLongitude: gymData.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should not be able to check in on non exists gym', async () => {
    vi.setSystemTime(new Date('2023-10-26T08:00:00.000z'));

    await expect(() =>
      sut.execute({
        userId: data.user_id,
        gymId: faker.string.uuid(),
        userLatitude: gymData.latitude,
        userLongitude: gymData.longitude,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 9, 26, 8, 0, 0));

    const gym = await gymsRepository.create(gymData);

    await sut.execute({
      userId: data.user_id,
      gymId: gym.id,
      userLatitude: gymData.latitude,
      userLongitude: gymData.longitude,
    });

    vi.setSystemTime(new Date(2023, 9, 27, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: data.user_id,
      gymId: gym.id,
      userLatitude: gymData.latitude,
      userLongitude: gymData.longitude,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2023, 9, 26, 8, 0, 0));

    const gym = await gymsRepository.create(gymData);

    await expect(() =>
      sut.execute({
        userId: data.user_id,
        gymId: gym.id,
        userLatitude: faker.location.latitude() + 1,
        userLongitude: faker.location.latitude() + 1,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
