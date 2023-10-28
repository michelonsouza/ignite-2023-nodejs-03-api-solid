import { ErrorWithStatusCode } from './error-with-status-code';

export class MaxNumberOfCheckInsError extends ErrorWithStatusCode {
  constructor() {
    super(400, 'Max number of check-ins reached');
  }
}
