import type { MondoInstance } from '../common/resources/init.js';
import { listItemsWithAuthorization } from '../common/resources/operations.js';
import { addPaginationToURL } from '../common/resources/utils.js';
import {
  type PaginationCollection,
  PaginationCollectionSchema,
} from '../common/schema/collection.js';
import type { Pagination } from '../common/schema/pagination.js';
import { type Activity, ActivitySchema } from './schema/schema.js';

export const PATH = '/v1/activities';

export class ActivityResources {
  public constructor(private readonly instance: MondoInstance) {}

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
  instance: MondoInstance,
  source: string,
  pagination?: Pagination
): Promise<PaginationCollection<Activity>> {
  const url = addPaginationToURL(
    new URL(ActivityResources.buildPath(source), instance.baseUrl),
    pagination
  );

  return PaginationCollectionSchema(ActivitySchema).parse(
    await listItemsWithAuthorization(url, instance.authorize)
  );
}
