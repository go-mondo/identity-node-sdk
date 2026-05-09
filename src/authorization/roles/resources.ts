import type { MondoInstance } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  patchItemWithAuthorization,
  postItemWithAuthorization,
} from '../../common/resources/operations.js';
import { addPaginationToURL } from '../../common/resources/utils.js';
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
  public constructor(private readonly instance: MondoInstance) {}

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

  public deleteItem(id: string): Promise<Role> {
    return deleteRole(this.instance, id);
  }
}

export async function listRoles(
  instance: MondoInstance,
  pagination?: Pagination
): Promise<PaginationCollection<Role>> {
  const url = addPaginationToURL(
    new URL(RoleResources.buildPath(), instance.baseUrl),
    pagination
  );
  return PaginationCollectionSchema(RoleSchema).parse(
    await getItemWithAuthorization(url, instance.authorize)
  );
}

export async function getRole(
  instance: MondoInstance,
  id: string
): Promise<Role> {
  return RoleSchema.parse(
    await getItemWithAuthorization(
      new URL(RoleResources.buildPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function insertRole(
  instance: MondoInstance,
  item: InsertRoleInput
): Promise<Role> {
  return RoleSchema.parse(
    await postItemWithAuthorization(
      new URL(RoleResources.buildPath(), instance.baseUrl),
      instance.authorize,
      InsertRolePayloadSchema.parse(item)
    )
  );
}

export async function updateRole(
  instance: MondoInstance,
  id: string,
  item: UpdateRoleInput
): Promise<Role> {
  return RoleSchema.parse(
    await patchItemWithAuthorization(
      new URL(RoleResources.buildPath(id), instance.baseUrl),
      instance.authorize,
      UpdateRolePayloadSchema.parse(item)
    )
  );
}

export async function deleteRole(
  instance: MondoInstance,
  id: string
): Promise<Role> {
  return RoleSchema.parse(
    await deleteItemWithAuthorization(
      new URL(RoleResources.buildPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}
