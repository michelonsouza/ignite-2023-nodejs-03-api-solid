import { differenceInMinutes, parseISO } from 'date-fns';

import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository';

import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const checkInDate =
      checkIn.created_at instanceof Date
        ? checkIn.created_at
        : parseISO(checkIn.created_at);
    const distanceInMinutesFromCheckInCreation = differenceInMinutes(
      new Date(),
      checkInDate,
    );

    const MAX_MINUTES_TO_VALIDATE_CHECK_IN = 20;

    if (
      distanceInMinutesFromCheckInCreation > MAX_MINUTES_TO_VALIDATE_CHECK_IN
    ) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
