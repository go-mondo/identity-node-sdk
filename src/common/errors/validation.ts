import { HttpError, type HttpErrorOptions } from './http.js';

export type ValidationErrorOptions = HttpErrorOptions & {
  fields: { [key: string]: string };
};

export class ValidationError extends HttpError {
  readonly fields: ValidationErrorOptions['fields'];

  public constructor(message: string, options: ValidationErrorOptions) {
    super(message, options);
    this.fields = options?.fields;
  }
}
