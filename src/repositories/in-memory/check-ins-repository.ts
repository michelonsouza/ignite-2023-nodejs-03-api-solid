import { randomUUID } from 'node:crypto';

import { startOfDay, endOfDay, isAfter, isBefore, parseISO } from 'date-fns';

import {
  CheckIn,
  CheckInCreateInput,
  CheckInsRepository,
} from '@repositories/check-ins-repository';

const MOCKED_PROMISE_TIME = 0;

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async findByUserIdOnDate(
    userId: string,
    date: string | Date,
  ): Promise<CheckIn | null> {
    return new Promise<CheckIn | null>(resolve => {
      const startOfTheDay = startOfDay(new Date(date));
      const endOfTheDay = endOfDay(new Date(date));

      const checkInOnSameDay = this.checkIns.find(checkIn => {
        const checkInDate =
          checkIn.created_at instanceof Date
            ? checkIn.created_at
            : parseISO(checkIn.created_at);
        const isOnSameDate =
          isAfter(checkInDate, startOfTheDay) &&
          isBefore(checkInDate, endOfTheDay);

        return checkIn.user_id === userId && isOnSameDate;
      });

      setTimeout(() => {
        resolve(checkInOnSameDay || null);
      }, MOCKED_PROMISE_TIME);
    });
  }

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

  async findManyByUserId(userId: string, page?: number): Promise<CheckIn[]> {
    return new Promise<CheckIn[]>(resolve => {
      setTimeout(() => {
        let checkIns = this.checkIns.filter(
          checkIn => checkIn.user_id === userId,
        );

        if (page) {
          checkIns = checkIns.slice((page - 1) * 20, page * 20);
        }
        resolve(checkIns);
      }, MOCKED_PROMISE_TIME);
    });
  }
}
