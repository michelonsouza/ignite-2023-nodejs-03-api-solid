import { randomUUID } from 'node:crypto';

import {
  Gym,
  GymsCreateInput,
  GymsRepository,
} from '@repositories/gyms-repository';

const MOCKED_PROMISE_TIME = 0;

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: GymsCreateInput): Promise<Gym> {
    return new Promise<Gym>(resolve => {
      const gym: Gym = {
        ...data,
        id: data?.id ?? randomUUID(),
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

  async searchMany(query: string, page?: number | undefined): Promise<Gym[]> {
    let gyms = this.gyms.filter(gym =>
      gym.title.toLowerCase().includes(query.toLowerCase()),
    );

    if (page) {
      gyms = gyms.slice((page - 1) * 20, page * 20);
    }

    return new Promise<Gym[]>(resolve => {
      setTimeout(() => {
        resolve(gyms);
      }, MOCKED_PROMISE_TIME);
    });
  }
}
