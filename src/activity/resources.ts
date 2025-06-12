import type { MondoIdentity } from '../common/resources/init.js';
import { getItemWithAuthorization } from '../common/resources/operations.js';
import {
  addPaginationToURL,
  parseEgressSchema,
} from '../common/resources/utils.js';
import {
  type PaginationCollection,
  PaginationCollectionSchema,
} from '../common/schema/collection.js';
import type { Pagination } from '../common/schema/pagination.js';
import { type Activity, ActivitySchema } from './schema/schema.js';

export const PATH = '/v1/activities';

export class ActivityResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(source: string): string {
    if (source.startsWith(PATH)) {
      return source;
    }

    return [PATH, source].filter(Boolean).join('/');
  }

  public listItems(
    source: string,
    pagination?: Pagination
  ): Promise<PaginationCollection<Activity>> {
    return listActivities(this.instance, source, pagination);
  }
}

export async function listActivities(
  instance: MondoIdentity,
  source: string,
  pagination?: Pagination
): Promise<PaginationCollection<Activity>> {
  const url = addPaginationToURL(
    new URL(ActivityResources.buildPath(source), instance.config.host),
    pagination
  );

  return parseEgressSchema(
    PaginationCollectionSchema(ActivitySchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );
}
