export type HttpErrorOptions = {
  statusCode?: number;
  type?: string;
};

export class HttpError extends Error {
  readonly statusCode: number;

  readonly type: string;
  public expose?: boolean = undefined;
  readonly headers?:
    | {
        [key: string]: string;
      }
    | undefined;
  readonly body?:
    | {
        [key: string]: string;
      }
    | undefined;

  public constructor(
    message = 'An unknown error occurred. Please try the operation again.',
    options?: HttpErrorOptions
  ) {
    super(message);

    this.statusCode = options?.statusCode || 500;
    this.type = options?.type || 'Unknown';
  }

  get isAuthorizationError(): boolean {
    return [401, 403].includes(this.statusCode);
  }
}
