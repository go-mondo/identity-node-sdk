import { type } from 'arktype';
import { HttpError } from '../errors/http.js';
import type { Pagination } from '../schema/pagination.js';

/**
 * Parse schema data that is calling the API
 */
export function parseEgressSchema<S>(output: S | type.errors): S {
  if (output instanceof type.errors) {
    console.warn(`Failed to parse egress payload: ${output.summary}`, {
      error: output,
    });

    throw output;
  }

  return output;
}

/**
 * Parse schema data that is returning from the API
 */
export function parseIngressSchema<S>(output: S | type.errors): S {
  if (output instanceof type.errors) {
    console.warn(`Failed to parse ingress payload: ${output.summary}`, {
      error: output,
    });
  }

  return output as S;
}

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

export function addPaginationToURL(url: URL, pagination?: Pagination): URL {
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

  return new HttpError(body?.error_description, {
    statusCode: response.status,
    type: body?.error,
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
