import { fakerPT_BR as faker } from '@faker-js/faker';
import { addDays } from 'date-fns';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { InMemoryCheckInsRepository } from '@repositories/in-memory/check-ins-repository';

import { GetUserMetricsUseCase } from './get-user-metrics';

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
let sut: GetUserMetricsUseCase;
let data: DataType;
let gymData: GymDataType;

async function makeCheckIns(quantity: number, userId?: string) {
  const gym = await gymsRepository.create(gymData);
  const userCheckIns = await Promise.all(
    Array(quantity)
      .fill(null)
      .map((_, index) =>
        checkInsRepository.create({
          ...data,
          gym_id: gym.id,
          user_id: userId ?? data?.user_id,
          created_at: addDays(new Date(), index),
        }),
      ),
  );

  return { gym, userCheckIns };
}

describe('🛠️  [USE CASES]: get user metrics', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
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
  });

  it('should be able get check-ins count from metrics', async () => {
    const { userCheckIns } = await makeCheckIns(
      faker.number.int({ min: 1, max: 30 }),
    );

    const { checkInsCount } = await sut.execute({
      userId: data.user_id,
    });

    expect(checkInsCount).toBe(userCheckIns.length);
  });
});
