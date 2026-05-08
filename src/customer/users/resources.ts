import type { MondoIdentity } from '../../common/resources/init.js';
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
  type InsertUserInput,
  InsertUserPayloadSchema,
  type UpdateUserInput,
  UpdateUserPayloadSchema,
  type User,
  UserSchema,
} from './schema.js';

const PATH = '/v1/customers/users';

export class UserResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(id?: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id].filter(Boolean).join('/');
  }

  public listItems(
    pagination?: Pagination
  ): Promise<PaginationCollection<User>> {
    return listUsers(this.instance, pagination);
  }

  public getItem(id: string): Promise<User> {
    return getUser(this.instance, id);
  }

  public insertItem(item: InsertUserInput): Promise<User> {
    return insertUser(this.instance, item);
  }

  public updateItem(id: string, item: UpdateUserInput): Promise<User> {
    return updateUser(this.instance, id, item);
  }

  public deleteItem(id: string): Promise<User> {
    return deleteUser(this.instance, id);
  }
}

export async function listUsers(
  instance: MondoIdentity,
  pagination?: Pagination
): Promise<PaginationCollection<User>> {
  const url = addPaginationToURL(
    new URL(UserResources.buildPath(), instance.config.host),
    pagination
  );

  return PaginationCollectionSchema(UserSchema).parse(
    await listItemsWithAuthorization(url, instance.authorize)
  );
}

export async function getUser(
  instance: MondoIdentity,
  id: string
): Promise<User> {
  return UserSchema.parse(
    await getItemWithAuthorization(
      new URL(UserResources.buildPath(id), instance.config.host),
      instance.authorize
    )
  );
}

export async function insertUser(
  instance: MondoIdentity,
  item: InsertUserInput
): Promise<User> {
  return UserSchema.parse(
    await postItemWithAuthorization(
      new URL(UserResources.buildPath(), instance.config.host),
      instance.authorize,
      InsertUserPayloadSchema.parse(item)
    )
  );
}

export async function updateUser(
  instance: MondoIdentity,
  id: string,
  item: UpdateUserInput
): Promise<User> {
  return UserSchema.parse(
    await patchItemWithAuthorization(
      new URL(UserResources.buildPath(id), instance.config.host),
      instance.authorize,
      UpdateUserPayloadSchema.parse(item)
    )
  );
}

export async function deleteUser(
  instance: MondoIdentity,
  id: string
): Promise<User> {
  return UserSchema.parse(
    await deleteItemWithAuthorization(
      new URL(UserResources.buildPath(id), instance.config.host),
      instance.authorize
    )
  );
}
