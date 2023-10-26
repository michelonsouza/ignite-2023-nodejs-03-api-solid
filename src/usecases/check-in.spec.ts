import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryCheckInsRepository } from '@repositories/in-memory/check-ins-repository';

import { CheckInUseCase } from './check-in';

interface DataType {
  user_id: string;
  gym_id: string;
  validated_at?: string | Date | null;
}

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;
let data: DataType;

describe('🛠️  [USE CASES]: check-ins', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
    data = {
      user_id: faker.string.uuid(),
      gym_id: faker.string.uuid(),
      validated_at: null,
    };
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: data.user_id,
      gymId: data.gym_id,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
