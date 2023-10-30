import type { Gym, GymsRepository } from '@repositories/gyms-repository';

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
  page?: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class GymFetchNearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      page,
    });

    return { gyms };
  }
}
