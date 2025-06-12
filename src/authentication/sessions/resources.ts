import type { MondoIdentity } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
} from '../../common/resources/operations.js';
import {
  addPaginationToURL,
  parseEgressSchema,
} from '../../common/resources/utils.js';
import {
  type PaginationCollection,
  PaginationCollectionSchema,
} from '../../common/schema/collection.js';
import type { Pagination } from '../../common/schema/pagination.js';
import { appendSearchParams } from '../../common/schema/url.js';
import { PATH } from '../resources.js';
import { type Session, SessionSchema } from './schema.js';

const RESOURCE = 'sessions';

export type SessionListingOptions = {
  filter?: {
    user?: string;
    app?: string;
  };
};

export class SessionResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(id: string): string {
    if (id.startsWith(PATH)) {
      return id;
    }

    return [PATH, RESOURCE, id].filter(Boolean).join('/');
  }

  static buildListingPath(options?: SessionListingOptions): string {
    return appendSearchParams(
      [PATH, RESOURCE].filter(Boolean).join('/'),
      new Map(
        // format the the keys to 'filter[<key>]'
        Array.from(Object.entries(options?.filter || {})).map(
          ([key, value]) => [`filter[${key}]`, value]
        )
      )
    );
  }

  public listItems(
    options?: SessionListingOptions,
    pagination?: Pagination
  ): Promise<PaginationCollection<Session>> {
    return listSessions(this.instance, options, pagination);
  }

  public deleteItem(id: string): Promise<Session> {
    return deleteSession(this.instance, id);
  }
}

export async function listSessions(
  instance: MondoIdentity,
  options?: SessionListingOptions,
  pagination?: Pagination
): Promise<PaginationCollection<Session>> {
  const url = addPaginationToURL(
    new URL(SessionResources.buildListingPath(options), instance.config.host),
    pagination
  );

  return parseEgressSchema(
    PaginationCollectionSchema(SessionSchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );
}

export async function deleteSession(
  instance: MondoIdentity,
  id: string
): Promise<Session> {
  return parseEgressSchema(
    SessionSchema(
      await deleteItemWithAuthorization(
        new URL(SessionResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );
}
