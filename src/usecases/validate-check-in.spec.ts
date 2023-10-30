import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { InMemoryCheckInsRepository } from '@repositories/in-memory/check-ins-repository';

import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

interface DataType {
  user_id: string;
  gym_id: string;
  validated_at?: string | Date | null;
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
let sut: ValidateCheckInUseCase;
let data: DataType;
let gymData: GymDataType;

describe('🛠️  [USE CASES]: check-ins', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);
    data = {
      user_id: faker.string.uuid(),
      gym_id: faker.string.uuid(),
      validated_at: null,
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

  it('should be able to validate the check-in', async () => {
    const gym = await gymsRepository.create(gymData);

    const checkInStub = await checkInsRepository.create({
      user_id: data.user_id,
      gym_id: gym.id,
    });

    const { checkIn } = await sut.execute({ checkInId: checkInStub.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: faker.string.uuid() }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 10, 30, 18, 0, 0));

    const gym = await gymsRepository.create(gymData);

    const checkInStub = await checkInsRepository.create({
      user_id: data.user_id,
      gym_id: gym.id,
    });

    const TWENTY_MINUTES_IN_MILLISECONDS = 21 * 60 * 1000;

    vi.advanceTimersByTime(TWENTY_MINUTES_IN_MILLISECONDS);

    await expect(() =>
      sut.execute({ checkInId: checkInStub.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
