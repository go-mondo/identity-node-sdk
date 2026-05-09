import type { MondoInstance } from '../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  patchItemWithAuthorization,
  postItemWithAuthorization,
} from '../common/resources/operations.js';
import { addPaginationToURL } from '../common/resources/utils.js';
import {
  type PaginationCollection,
  PaginationCollectionSchema,
} from '../common/schema/collection.js';
import type { Pagination } from '../common/schema/pagination.js';
import {
  type App,
  AppSchema,
  type InsertAppInput,
  InsertAppPayloadSchema,
  type UpdateAppInput,
  UpdateAppPayloadSchema,
} from './schema.js';

export const PATH = '/v1/apps';

export class AppResources {
  public constructor(private readonly instance: MondoInstance) {}

  static buildPath(id?: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id].filter(Boolean).join('/');
  }

  public listItems(
    pagination?: Pagination
  ): Promise<PaginationCollection<App>> {
    return listApps(this.instance, pagination);
  }

  public getItem(id: string): Promise<App> {
    return getApp(this.instance, id);
  }

  public insertItem(item: InsertAppInput): Promise<App> {
    return insertApp(this.instance, item);
  }

  public updateItem(id: string, item: UpdateAppInput): Promise<App> {
    return updateApp(this.instance, id, item);
  }

  public deleteItem(id: string): Promise<App> {
    return deleteApp(this.instance, id);
  }
}

export async function listApps(
  instance: MondoInstance,
  pagination?: Pagination
): Promise<PaginationCollection<App>> {
  const url = addPaginationToURL(
    new URL(AppResources.buildPath(), instance.baseUrl),
    pagination
  );

  return PaginationCollectionSchema(AppSchema).parse(
    await getItemWithAuthorization(url, instance.authorize)
  );
}

export async function getApp(
  instance: MondoInstance,
  id: string
): Promise<App> {
  return AppSchema.parse(
    await getItemWithAuthorization(
      new URL(AppResources.buildPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function insertApp(
  instance: MondoInstance,
  item: InsertAppInput
): Promise<App> {
  return AppSchema.parse(
    await postItemWithAuthorization(
      new URL(AppResources.buildPath(), instance.baseUrl),
      instance.authorize,
      InsertAppPayloadSchema.parse(item)
    )
  );
}

export async function updateApp(
  instance: MondoInstance,
  id: string,
  item: UpdateAppInput
): Promise<App> {
  return AppSchema.parse(
    await patchItemWithAuthorization(
      new URL(AppResources.buildPath(id), instance.baseUrl),
      instance.authorize,
      UpdateAppPayloadSchema.parse(item)
    )
  );
}

export async function deleteApp(
  instance: MondoInstance,
  id: string
): Promise<App> {
  return AppSchema.parse(
    await deleteItemWithAuthorization(
      new URL(AppResources.buildPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}
