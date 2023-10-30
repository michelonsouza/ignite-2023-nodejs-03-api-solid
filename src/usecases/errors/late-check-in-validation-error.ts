import { ErrorWithStatusCode } from './error-with-status-code';

export class LateCheckInValidationError extends ErrorWithStatusCode {
  constructor() {
    super(400, 'The check-in can only be validated within 20 minutes');
  }
}
