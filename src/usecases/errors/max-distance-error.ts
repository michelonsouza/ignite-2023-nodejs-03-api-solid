import { ErrorWithStatusCode } from './error-with-status-code';

export class MaxDistanceError extends ErrorWithStatusCode {
  constructor() {
    super(400, 'Max distance reached');
  }
}
