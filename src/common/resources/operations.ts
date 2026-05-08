import type { Authorizer } from './authorization.js';
import {
  defaultMutationRequestHeaders,
  defaultRequestHeaders,
  jsonBody,
  responseToHttpError,
  toHttpError,
} from './utils.js';

export async function listItemsWithAuthorization<Result>(
  url: URL,
  authorizer: Authorizer
): Promise<Result> {
  try {
    console.debug('List items', { url });

    const response = await fetchWithAuthorization(url, authorizer, {
      method: 'GET',
      headers: defaultRequestHeaders(),
    });

    if (response.ok) {
      return await response.json();
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function getItemWithAuthorization<Result>(
  url: URL,
  authorizer: Authorizer
): Promise<Result> {
  try {
    console.debug('GET item', { url });

    const response = await fetchWithAuthorization(url, authorizer, {
      method: 'GET',
      headers: defaultRequestHeaders(),
    });

    if (response.ok) {
      return await response.json();
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function patchItemWithAuthorization<Result, Mutation>(
  url: URL,
  authorizer: Authorizer,
  item: Mutation
): Promise<Result> {
  return mutateItemWithAuthorization('PATCH', url, authorizer, item);
}

export async function putItemWithAuthorization<Result, Mutation>(
  url: URL,
  authorizer: Authorizer,
  item: Mutation
): Promise<Result> {
  return mutateItemWithAuthorization('PUT', url, authorizer, item);
}

async function mutateItemWithAuthorization<Result, Mutation>(
  method: 'PUT' | 'PATCH',
  url: URL,
  authorizer: Authorizer,
  item: Mutation
): Promise<Result> {
  try {
    console.debug(`${method} item`, { url, item });

    const response = await fetchWithAuthorization(url, authorizer, {
      method,
      headers: defaultMutationRequestHeaders(),
      body: JSON.stringify(item),
    });

    if (response.ok) {
      return await response.json();
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function postItemWithAuthorization<Result, Mutation>(
  url: URL,
  authorizer: Authorizer,
  item?: Mutation
): Promise<Result> {
  try {
    console.debug('POST item', { url, item });

    const response = await fetchWithAuthorization(url, authorizer, {
      method: 'POST',
      headers: defaultMutationRequestHeaders(),
      body: item ? JSON.stringify(item) : undefined,
    });

    if (response.ok) {
      return await response.json();
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function deleteItemWithAuthorization<Result>(
  url: URL,
  authorizer: Authorizer
): Promise<Result> {
  try {
    console.debug('Delete item', { url });

    const response = await fetchWithAuthorization(url, authorizer, {
      method: 'DELETE',
      headers: defaultRequestHeaders(),
    });

    if (response.ok) {
      return (await jsonBody<Result>(response)) as Result;
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

async function fetchWithAuthorization(
  url: URL,
  authorizer: Authorizer,
  request: RequestInit
): Promise<Response> {
  const response = await fetch(
    url,
    await authorizer(cloneRequestInit(request))
  );

  if (!isAuthorizationResponse(response)) {
    return response;
  }

  return fetch(
    url,
    await authorizer(cloneRequestInit(request), { refresh: true })
  );
}

function isAuthorizationResponse(response: Response): boolean {
  return [401, 403].includes(response.status);
}

function cloneRequestInit(request: RequestInit): RequestInit {
  return {
    ...request,
    headers: new Headers(request.headers),
  };
}
