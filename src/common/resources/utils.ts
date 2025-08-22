import { HttpError } from '../errors/http.js';
import { ValidationError } from '../errors/validation.js';
import type { Pagination } from '../schema/pagination.js';

export function defaultRequestHeaders(): Headers {
  return new Headers([['accept', 'application/json']]);
}

export function defaultMutationRequestHeaders(): Headers {
  const headers = defaultRequestHeaders();

  headers.append('Content-Type', 'application/json');

  return headers;
}

export async function jsonBody<R>(
  message: Request | Response
): Promise<R | undefined> {
  try {
    return await message.json();
  } catch (error) {
    return undefined;
  }
}

export function addPaginationToURL(
  url: URL,
  pagination?: Pagination | null
): URL {
  if (pagination?.nextToken != null) {
    url.searchParams.set('pagination[nextToken]', pagination.nextToken);
  }

  if (pagination?.pageSize != null) {
    url.searchParams.set('pagination[pageSize]', String(pagination.pageSize));
  }

  return url;
}

export async function responseToHttpError(
  response: Response
): Promise<HttpError> {
  const body = await response.json();

  // Authorization errors
  if ([401, 403].includes(response.status)) {
    return new HttpError(body?.error_description || 'Unauthorized', {
      statusCode: response.status,
      type: body?.error || 'authorization',
    });
  }

  const {
    error: type,
    error_description: message,
    trace,
    fields,
    ...data
  } = body;

  if (fields) {
    return new ValidationError(message, {
      statusCode: response.status,
      type,
      trace,
      body: data,
      fields,
    });
  }

  return new HttpError(message, {
    statusCode: response.status,
    type,
    trace,
    body: data,
  });
}

export function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return new HttpError(String(error.message));
  }

  return new HttpError();
}
