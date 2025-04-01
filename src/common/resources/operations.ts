import type { Authorization } from './authorization.js';
import {
  defaultMutationRequestHeaders,
  defaultRequestHeaders,
  jsonBody,
  responseToHttpError,
  toHttpError,
} from './utils.js';

export async function listItemsWithAuthorization<Result>(
  url: URL,
  authorization: Authorization
): Promise<Result> {
  try {
    console.debug('List items', { url });

    const response = await fetch(
      url,
      authorization({
        method: 'GET',
        headers: defaultRequestHeaders(),
      })
    );

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
  authorization: Authorization
): Promise<Result> {
  try {
    console.debug('Get item', { url });

    const response = await fetch(
      url,
      authorization({
        method: 'GET',
        headers: defaultRequestHeaders(),
      })
    );

    if (response.ok) {
      return await response.json();
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function updateItemWithAuthorization<Result, Mutation>(
  url: URL,
  authorization: Authorization,
  item: Mutation
): Promise<Result> {
  try {
    console.debug('Update item', { url, item });

    const response = await fetch(
      url,
      authorization({
        method: 'PUT',
        headers: defaultMutationRequestHeaders(),
        body: JSON.stringify(item),
      })
    );

    if (response.ok) {
      return await response.json();
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function insertItemWithAuthorization<Result, Mutation>(
  url: URL,
  authorization: Authorization,
  item?: Mutation
): Promise<Result> {
  try {
    console.debug('Insert item', { url, item });

    const response = await fetch(
      url,
      authorization({
        method: 'POST',
        headers: defaultMutationRequestHeaders(),
        body: item ? JSON.stringify(item) : undefined,
      })
    );

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
  authorization: Authorization
): Promise<Result> {
  try {
    console.debug('Delete item', { url });

    const response = await fetch(
      url,
      authorization({
        method: 'DELETE',
        headers: defaultRequestHeaders(),
      })
    );

    if (response.ok) {
      return (await jsonBody<Result>(response)) as Result;
    }

    throw await responseToHttpError(response);
  } catch (error) {
    throw toHttpError(error);
  }
}
