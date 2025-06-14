import type { MondoIdentity } from '../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
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
import { appendSearchParams } from '../common/schema/url.js';
import {
  type AnyAssociationObjectType,
  type Association,
  type AssociationObject,
  AssociationSchema,
  type UpsertAssociationInput,
  UpsertAssociationPayloadSchema,
} from './schema.js';

export const PATH = '/v1/associations';

export type AssociationListingOptions = {
  filter?: {
    type?: AnyAssociationObjectType;
  };
};

export class AssociationResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(fromId: string, toId: string): string {
    if (fromId.startsWith(PATH)) {
      return fromId;
    }

    return [PATH, fromId, toId].filter(Boolean).join('/');
  }

  static buildListingPath(
    fromId: string,
    options?: AssociationListingOptions
  ): string {
    return appendSearchParams(
      [PATH, fromId].filter(Boolean).join('/'),
      new Map(
        // format the the keys to 'filter[<key>]'
        Array.from(Object.entries(options?.filter || {})).map(
          ([key, value]) => [`filter[${key}]`, value]
        )
      )
    );
  }

  public listItems<O extends AssociationObject>(
    fromId: string,
    options?: AssociationListingOptions,
    pagination?: Pagination
  ): Promise<PaginationCollection<Association<O>>> {
    return listAssociations<O>(this.instance, fromId, options, pagination);
  }

  public upsertItem<O extends AssociationObject>(
    fromId: string,
    toId: string,
    item: UpsertAssociationInput
  ): Promise<Association<O>> {
    return upsertAssociation<O>(this.instance, fromId, toId, item);
  }

  public deleteItem<O extends AssociationObject>(
    fromId: string,
    toId: string
  ): Promise<Association<O>> {
    return deleteAssociation(this.instance, fromId, toId);
  }
}

export async function listAssociations<O extends AssociationObject>(
  instance: MondoIdentity,
  id: string,
  options?: AssociationListingOptions,
  pagination?: Pagination
): Promise<PaginationCollection<Association<O>>> {
  const url = addPaginationToURL(
    new URL(
      AssociationResources.buildListingPath(id, options),
      instance.config.host
    ),
    pagination
  );

  return parseEgressSchema(
    PaginationCollectionSchema(AssociationSchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  ) as unknown as Promise<PaginationCollection<Association<O>>>;
}

export async function upsertAssociation<O extends AssociationObject>(
  instance: MondoIdentity,
  fromId: string,
  toId: string,
  item?: UpsertAssociationInput
): Promise<Association<O>> {
  return parseEgressSchema(
    AssociationSchema(
      await updateItemWithAuthorization(
        new URL(
          AssociationResources.buildPath(fromId, toId),
          instance.config.host
        ),
        instance.authorizer,
        item
          ? parseEgressSchema(
              UpsertAssociationPayloadSchema.onUndeclaredKey('delete')(item)
            )
          : undefined
      )
    )
  ) as unknown as Promise<Association<O>>;
}

export async function deleteAssociation<O extends AssociationObject>(
  instance: MondoIdentity,
  fromId: string,
  toId: string
): Promise<Association<O>> {
  return parseEgressSchema(
    AssociationSchema(
      await deleteItemWithAuthorization(
        new URL(
          AssociationResources.buildPath(fromId, toId),
          instance.config.host
        ),
        instance.authorizer
      )
    )
  ) as unknown as Promise<Association<O>>;
}
