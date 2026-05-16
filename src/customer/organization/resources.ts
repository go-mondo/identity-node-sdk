import type * as z from 'zod/v4';
import type { MondoInstance } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  listItemsWithAuthorization,
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
  type Organization,
  OrganizationSchema,
  InsertOrganizationPayloadSchema,
  UpdateOrganizationPayloadSchema,
} from './schema.js';

const PATH = '/v1/customers/organizations';

export type InsertOrganizationInput = z.input<
  typeof InsertOrganizationPayloadSchema
>;
export type UpdateOrganizationInput = z.input<
  typeof UpdateOrganizationPayloadSchema
>;

export class OrganizationResources {
  public constructor(private readonly instance: MondoInstance) {}

  static buildPath(id?: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id].filter(Boolean).join('/');
  }

  public listItems(
    pagination?: Pagination
  ): Promise<PaginationCollection<Organization>> {
    return listOrganizations(this.instance, pagination);
  }

  public getItem(id: string): Promise<Organization> {
    return getOrganization(this.instance, id);
  }

  public insertItem(item: InsertOrganizationInput): Promise<Organization> {
    return insertOrganization(this.instance, item);
  }

  public updateItem(
    id: string,
    item: UpdateOrganizationInput
  ): Promise<Organization> {
    return updateOrganization(this.instance, id, item);
  }

  public deleteItem(id: string): Promise<Organization> {
    return deleteOrganization(this.instance, id);
  }
}

export async function listOrganizations(
  instance: MondoInstance,
  pagination?: Pagination
): Promise<PaginationCollection<Organization>> {
  const url = addPaginationToURL(
    new URL(OrganizationResources.buildPath(), instance.baseUrl),
    pagination
  );

  return PaginationCollectionSchema(OrganizationSchema).parse(
    await listItemsWithAuthorization(url, instance.authorize)
  );
}

export async function getOrganization(
  instance: MondoInstance,
  id: string
): Promise<Organization> {
  return OrganizationSchema.parse(
    await getItemWithAuthorization(
      new URL(OrganizationResources.buildPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function insertOrganization(
  instance: MondoInstance,
  item: InsertOrganizationInput
): Promise<Organization> {
  return OrganizationSchema.parse(
    await postItemWithAuthorization(
      new URL(OrganizationResources.buildPath(), instance.baseUrl),
      instance.authorize,
      InsertOrganizationPayloadSchema.parse(item)
    )
  );
}

export async function updateOrganization(
  instance: MondoInstance,
  id: string,
  item: UpdateOrganizationInput
): Promise<Organization> {
  return OrganizationSchema.parse(
    await patchItemWithAuthorization(
      new URL(OrganizationResources.buildPath(id), instance.baseUrl),
      instance.authorize,
      UpdateOrganizationPayloadSchema.parse(item)
    )
  );
}

export async function deleteOrganization(
  instance: MondoInstance,
  id: string
): Promise<Organization> {
  return OrganizationSchema.parse(
    await deleteItemWithAuthorization(
      new URL(OrganizationResources.buildPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}
