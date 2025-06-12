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
import { PATH } from '../resources.js';
import {
  type InsertStrategyInput,
  InsertStrategyPayloadSchema,
  type Strategy,
  StrategySchema,
  type UpdateStrategyInput,
  UpdateStrategyPayloadSchema,
} from './schema/schema.js';

const RESOURCE = 'strategies';

export class StrategyResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(id?: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id].filter(Boolean).join('/');
  }

  public listItems(
    pagination?: Pagination
  ): Promise<PaginationCollection<Strategy>> {
    return listStrategies(this.instance, pagination);
  }

  public getItem(id: string): Promise<Strategy> {
    return getStrategy(this.instance, id);
  }

  public insertItem(item: InsertStrategyInput): Promise<Strategy> {
    return insertStrategy(this.instance, item);
  }

  public updateItem(id: string, item: UpdateStrategyInput): Promise<Strategy> {
    return updateStrategy(this.instance, id, item);
  }

  public deleteItem(id: string): Promise<Strategy> {
    return deleteStrategy(this.instance, id);
  }
}

export async function listStrategies(
  instance: MondoIdentity,
  pagination?: Pagination
): Promise<PaginationCollection<Strategy>> {
  const url = addPaginationToURL(
    new URL(StrategyResources.buildPath(), instance.config.host),
    pagination
  );

  return parseEgressSchema(
    PaginationCollectionSchema(StrategySchema)(
      await getItemWithAuthorization(url, instance.authorizer)
    )
  );
}

export async function getStrategy(
  instance: MondoIdentity,
  id: string
): Promise<Strategy> {
  return parseEgressSchema(
    StrategySchema(
      await getItemWithAuthorization(
        new URL(StrategyResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );
}

export async function insertStrategy(
  instance: MondoIdentity,
  item: InsertStrategyInput
): Promise<Strategy> {
  return parseEgressSchema(
    StrategySchema(
      await insertItemWithAuthorization(
        new URL(StrategyResources.buildPath(), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          InsertStrategyPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}

export async function updateStrategy(
  instance: MondoIdentity,
  id: string,
  item: UpdateStrategyInput
): Promise<Strategy> {
  return parseEgressSchema(
    StrategySchema(
      await updateItemWithAuthorization(
        new URL(StrategyResources.buildPath(id), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpdateStrategyPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}

export async function deleteStrategy(
  instance: MondoIdentity,
  id: string
): Promise<Strategy> {
  return parseEgressSchema(
    StrategySchema(
      await deleteItemWithAuthorization(
        new URL(StrategyResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );
}
