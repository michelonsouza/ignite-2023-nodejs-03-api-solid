import { ErrorWithStatusCode } from './error-with-status-code';

export class ResourceNotFoundError extends ErrorWithStatusCode {
  constructor() {
    super(404, 'Resource not found');
  }
}
