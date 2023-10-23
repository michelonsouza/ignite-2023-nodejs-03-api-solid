import { ErrorWithStatusCode } from './error-with-status-code';

export class InvalidCredentiasError extends ErrorWithStatusCode {
  constructor() {
    super(400, 'Invalid credentials');
  }
}
