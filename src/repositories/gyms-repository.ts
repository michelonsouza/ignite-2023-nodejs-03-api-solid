export interface Gym {
  id: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number | string;
  longitude: number | string;
}

export interface GymsCreateInput {
  id?: string;
  title: string;
  description?: string | null;
  phone?: string | null;
  latitude: number | string;
  longitude: number | string;
}

export interface GymsRepository {
  create(data: GymsCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
}
