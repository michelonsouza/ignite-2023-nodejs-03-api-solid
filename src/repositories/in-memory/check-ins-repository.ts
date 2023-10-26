import { randomUUID } from 'node:crypto';

import {
  CheckIn,
  CheckInCreateInput,
  CheckInsRepository,
} from '@repositories/check-ins-repository';

const MOCKED_PROMISE_TIME = 0;

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: CheckInCreateInput) {
    return new Promise<CheckIn>(resolve => {
      const checkIn: CheckIn = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        ...data,
        validated_at: data?.validated_at ? new Date(data.validated_at) : null,
      };

      setTimeout(() => {
        this.checkIns.push(checkIn);

        resolve(checkIn);
      }, MOCKED_PROMISE_TIME);
    });
  }
}
