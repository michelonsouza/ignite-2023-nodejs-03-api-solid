export interface Gym {
  id: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

export interface GymsCreateInput {
  id?: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  create(data: GymsCreateInput): Promise<Gym>;
  searchMany(query: string, page?: number): Promise<Gym[]>;
  findById(id: string): Promise<Gym | null>;
}
