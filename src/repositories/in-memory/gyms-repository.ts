import { randomUUID } from 'node:crypto';

import {
  Gym,
  GymsCreateInput,
  GymsRepository,
} from '@repositories/gyms-repository';

const MOCKED_PROMISE_TIME = 0;

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  create(data: GymsCreateInput): Promise<Gym> {
    return new Promise<Gym>(resolve => {
      const gym: Gym = {
        id: randomUUID(),
        ...data,
        description: data?.description || null,
        phone: data?.phone || null,
      };

      setTimeout(() => {
        this.gyms.push(gym);

        resolve(gym);
      }, MOCKED_PROMISE_TIME);
    });
  }

  async findById(id: string): Promise<Gym | null> {
    return new Promise<Gym | null>(resolve => {
      const gym = this.gyms.find(searchGym => searchGym.id === id) || null;

      setTimeout(() => {
        resolve(gym);
      }, MOCKED_PROMISE_TIME);
    });
  }
}
