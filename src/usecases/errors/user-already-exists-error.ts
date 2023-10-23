import { ErrorWithStatusCode } from './error-with-status-code';

export class UserAlreadyExistsError extends ErrorWithStatusCode {
  constructor() {
    super(409, 'E-mail already exists.');
  }
}
