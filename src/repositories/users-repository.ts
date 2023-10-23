interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
}

type UserCreateInput = Omit<User, 'created_at' | 'id'>;

export interface UsersRepository {
  create(data: UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
