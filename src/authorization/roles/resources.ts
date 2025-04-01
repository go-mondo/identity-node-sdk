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
  type InsertRoleInput,
  InsertRolePayloadSchema,
  type Role,
  RoleSchema,
  type UpdateRoleInput,
  UpdateRolePayloadSchema,
} from './schema.js';

const PATH = '/v1/authorization/roles';

export class RoleResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(id?: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id].filter(Boolean).join('/');
  }

  public listItems(
    pagination?: Pagination
  ): Promise<PaginationCollection<Role>> {
    return listRoles(this.instance, pagination);
  }

  public getItem(id: string): Promise<Role> {
    return getRole(this.instance, id);
  }

  public insertItem(item: InsertRoleInput): Promise<Role> {
    return insertRole(this.instance, item);
  }

  public updateItem(id: string, item: UpdateRoleInput): Promise<Role> {
    return updateRole(this.instance, id, item);
  }

  public deleteItem(id: string): Promise<void> {
    return deleteRole(this.instance, id);
  }
}

export async function listRoles(
  instance: MondoIdentity,
  pagination?: Pagination
): Promise<PaginationCollection<Role>> {
  console.groupCollapsed('Mondo Identity SDK: Roles');

  const url = addPaginationToURL(
    new URL(RoleResources.buildPath(), instance.config.host),
    pagination
  );

  const result = parseEgressSchema(
    PaginationCollectionSchema(RoleSchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );

  console.groupEnd();

  return result;
}

export async function getRole(
  instance: MondoIdentity,
  id: string
): Promise<Role> {
  console.groupCollapsed('Mondo Identity SDK: Roles');

  const result = parseEgressSchema(
    RoleSchema(
      await getItemWithAuthorization(
        new URL(RoleResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function insertRole(
  instance: MondoIdentity,
  item: InsertRoleInput
): Promise<Role> {
  console.groupCollapsed('Mondo Identity SDK: Roles');

  const result = parseEgressSchema(
    RoleSchema(
      await insertItemWithAuthorization(
        new URL(RoleResources.buildPath(), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          InsertRolePayloadSchema.onDeepUndeclaredKey('delete')(item)
        )
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function updateRole(
  instance: MondoIdentity,
  id: string,
  item: UpdateRoleInput
): Promise<Role> {
  console.groupCollapsed('Mondo Identity SDK: Roles');

  const result = parseEgressSchema(
    RoleSchema(
      await updateItemWithAuthorization(
        new URL(RoleResources.buildPath(id), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpdateRolePayloadSchema.onDeepUndeclaredKey('delete')(item)
        )
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function deleteRole(
  instance: MondoIdentity,
  id: string
): Promise<void> {
  console.groupCollapsed('Mondo Identity SDK: Roles');

  await deleteItemWithAuthorization(
    new URL(RoleResources.buildPath(id), instance.config.host),
    instance.authorizer
  );

  console.groupEnd();
}
