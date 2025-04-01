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
  type InsertUserInput,
  InsertUserPayloadSchema,
  type UpdateUserInput,
  UpdateUserPayloadSchema,
  type User,
  UserSchema,
} from './schema.js';

const PATH = '/v1/authorization/user';

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

  public deleteItem(id: string): Promise<void> {
    return deleteUser(this.instance, id);
  }
}

export async function listUsers(
  instance: MondoIdentity,
  pagination?: Pagination
): Promise<PaginationCollection<User>> {
  console.groupCollapsed('Mondo Identity SDK: Users');

  const url = addPaginationToURL(
    new URL(UserResources.buildPath(), instance.config.host),
    pagination
  );

  const result = parseEgressSchema(
    PaginationCollectionSchema(UserSchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );

  console.groupEnd();

  return result;
}

export async function getUser(
  instance: MondoIdentity,
  id: string
): Promise<User> {
  console.groupCollapsed('Mondo Identity SDK: Users');

  const result = parseEgressSchema(
    UserSchema(
      await getItemWithAuthorization(
        new URL(UserResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function insertUser(
  instance: MondoIdentity,
  item: InsertUserInput
): Promise<User> {
  console.groupCollapsed('Mondo Identity SDK: Users');

  const result = parseEgressSchema(
    UserSchema(
      await insertItemWithAuthorization(
        new URL(UserResources.buildPath(), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          InsertUserPayloadSchema.onDeepUndeclaredKey('delete')(item)
        )
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function updateUser(
  instance: MondoIdentity,
  id: string,
  item: UpdateUserInput
): Promise<User> {
  console.groupCollapsed('Mondo Identity SDK: Users');

  const result = parseEgressSchema(
    UserSchema(
      await updateItemWithAuthorization(
        new URL(UserResources.buildPath(id), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpdateUserPayloadSchema.onDeepUndeclaredKey('delete')(item)
        )
      )
    )
  );

  console.groupEnd();

  return result;
}

export async function deleteUser(
  instance: MondoIdentity,
  id: string
): Promise<void> {
  console.groupCollapsed('Mondo Identity SDK: Users');

  await deleteItemWithAuthorization(
    new URL(UserResources.buildPath(id), instance.config.host),
    instance.authorizer
  );

  console.groupEnd();
}
