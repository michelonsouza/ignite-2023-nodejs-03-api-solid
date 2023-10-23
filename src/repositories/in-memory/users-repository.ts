import { randomUUID } from 'node:crypto';

import {
  User,
  UsersRepository,
  UserCreateInput,
} from '@repositories/users-repository';

const MOCKED_PROMISE_TIME = 0;

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create(data: UserCreateInput) {
    return new Promise<User>(resolve => {
      const user: User = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        ...data,
      };

      setTimeout(() => {
        this.users.push(user);

        resolve(user);
      }, MOCKED_PROMISE_TIME);
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return new Promise<User | null>(resolve => {
      const user =
        this.users.find(searchUser => searchUser.email === email) || null;

      setTimeout(() => {
        resolve(user);
      }, MOCKED_PROMISE_TIME);
    });
  }
}
