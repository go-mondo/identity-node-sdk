import type { MondoIdentity } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  insertItemWithAuthorization,
  updateItemWithAuthorization,
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
import {
  type InsertPermissionInput,
  InsertPermissionPayloadSchema,
  type Permission,
  PermissionSchema,
  type UpdatePermissionInput,
  UpdatePermissionPayloadSchema,
} from './schema.js';

const PATH = '/v1/authorization/permissions';

export class PermissionResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(id?: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id].filter(Boolean).join('/');
  }

  public listItems(
    pagination?: Pagination
  ): Promise<PaginationCollection<Permission>> {
    return listPermissions(this.instance, pagination);
  }

  public getItem(id: string): Promise<Permission> {
    return getPermission(this.instance, id);
  }

  public insertItem(item: InsertPermissionInput): Promise<Permission> {
    return insertPermission(this.instance, item);
  }

  public updateItem(
    id: string,
    item: UpdatePermissionInput
  ): Promise<Permission> {
    return updatePermission(this.instance, id, item);
  }

  public deleteItem(id: string): Promise<void> {
    return deletePermission(this.instance, id);
  }
}

export async function listPermissions(
  instance: MondoIdentity,
  pagination?: Pagination
): Promise<PaginationCollection<Permission>> {
  console.groupCollapsed('Mondo Identity SDK: Permissions');

  const url = addPaginationToURL(
    new URL(PermissionResources.buildPath(), instance.config.host),
    pagination
  );

  const result = parseEgressSchema(
    PaginationCollectionSchema(PermissionSchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );

  console.groupEnd();

  return result;
}

export async function getPermission(
  instance: MondoIdentity,
  id: string
): Promise<Permission> {
  console.groupCollapsed('Mondo Identity SDK: Permissions');

  const result = parseEgressSchema(
    PermissionSchema(
      await getItemWithAuthorization(
        new URL(PermissionResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function insertPermission(
  instance: MondoIdentity,
  item: InsertPermissionInput
): Promise<Permission> {
  console.groupCollapsed('Mondo Identity SDK: Permissions');

  const result = parseEgressSchema(
    PermissionSchema(
      await insertItemWithAuthorization(
        new URL(PermissionResources.buildPath(), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          InsertPermissionPayloadSchema.onDeepUndeclaredKey('delete')(item)
        )
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function updatePermission(
  instance: MondoIdentity,
  id: string,
  item: UpdatePermissionInput
): Promise<Permission> {
  console.groupCollapsed('Mondo Identity SDK: Permissions');

  const result = parseEgressSchema(
    PermissionSchema(
      await updateItemWithAuthorization(
        new URL(PermissionResources.buildPath(id), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpdatePermissionPayloadSchema.onDeepUndeclaredKey('delete')(item)
        )
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function deletePermission(
  instance: MondoIdentity,
  id: string
): Promise<void> {
  console.groupCollapsed('Mondo Identity SDK: Permissions');

  await deleteItemWithAuthorization(
    new URL(PermissionResources.buildPath(id), instance.config.host),
    instance.authorizer
  );

  console.groupEnd();
}
