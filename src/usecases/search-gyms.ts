import type { Gym, GymsRepository } from '@repositories/gyms-repository';

interface SearchGymsUseCaseRequest {
  query: string;
  page?: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class GymSearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
