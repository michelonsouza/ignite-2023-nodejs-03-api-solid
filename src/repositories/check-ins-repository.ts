export interface CheckIn {
  id: string;
  validated_at?: Date | string | null;
  created_at: Date | string | null;
  user_id: string;
  gym_id: string;
}

export interface CheckInCreateInput {
  id?: string;
  user_id: string;
  gym_id: string;
  validated_at?: Date | string | null;
}

export interface CheckInsRepository {
  create(data: CheckInCreateInput): Promise<CheckIn>;
}
