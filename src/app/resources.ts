import type { MondoIdentity } from '../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  insertItemWithAuthorization,
  updateItemWithAuthorization,
} from '../common/resources/operations.js';
import {
  addPaginationToURL,
  parseEgressSchema,
} from '../common/resources/utils.js';
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
  public constructor(private readonly instance: MondoIdentity) {}

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
  instance: MondoIdentity,
  pagination?: Pagination
): Promise<PaginationCollection<App>> {
  const url = addPaginationToURL(
    new URL(AppResources.buildPath(), instance.config.host),
    pagination
  );

  return parseEgressSchema(
    PaginationCollectionSchema(AppSchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );
}

export async function getApp(
  instance: MondoIdentity,
  id: string
): Promise<App> {
  return parseEgressSchema(
    AppSchema(
      await getItemWithAuthorization(
        new URL(AppResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );
}

export async function insertApp(
  instance: MondoIdentity,
  item: InsertAppInput
): Promise<App> {
  return parseEgressSchema(
    AppSchema(
      await insertItemWithAuthorization(
        new URL(AppResources.buildPath(), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          InsertAppPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}

export async function updateApp(
  instance: MondoIdentity,
  id: string,
  item: UpdateAppInput
): Promise<App> {
  return parseEgressSchema(
    AppSchema(
      await updateItemWithAuthorization(
        new URL(AppResources.buildPath(id), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpdateAppPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}

export async function deleteApp(
  instance: MondoIdentity,
  id: string
): Promise<App> {
  return parseEgressSchema(
    AppSchema(
      await deleteItemWithAuthorization(
        new URL(AppResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );
}
