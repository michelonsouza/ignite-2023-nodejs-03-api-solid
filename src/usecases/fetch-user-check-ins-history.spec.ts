import { fakerPT_BR as faker } from '@faker-js/faker';
import { addDays } from 'date-fns';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { InMemoryCheckInsRepository } from '@repositories/in-memory/check-ins-repository';

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

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
let sut: FetchUserCheckInsHistoryUseCase;
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

describe('🛠️  [USE CASES]: check-ins', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
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

  it('should be able to fetch check-in history', async () => {
    const { userCheckIns } = await makeCheckIns(3);

    const { checkIns } = await sut.execute({
      userId: data.user_id,
    });

    expect(checkIns).toHaveLength(userCheckIns.length);
    expect(checkIns).toEqual(userCheckIns);
  });

  it('should be able to fetch paginated check-in history', async () => {
    const { userCheckIns } = await makeCheckIns(22);
    const checkIn21 = userCheckIns[20];
    const checkIn22 = userCheckIns[21];

    const { checkIns } = await sut.execute({
      userId: data.user_id,
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([checkIn21, checkIn22]);
  });
});
