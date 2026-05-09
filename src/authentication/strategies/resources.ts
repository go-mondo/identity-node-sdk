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
  public constructor(private readonly instance: MondoInstance) {}

  static buildItemPath(id: string): string {
    return [StrategyResources.buildPath(), id].filter(Boolean).join('/');
  }

  static buildPath(): string {
    return [PATH, RESOURCE].filter(Boolean).join('/');
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
  instance: MondoInstance,
  pagination?: Pagination
): Promise<PaginationCollection<Strategy>> {
  const url = addPaginationToURL(
    new URL(StrategyResources.buildPath(), instance.baseUrl),
    pagination
  );
  return PaginationCollectionSchema(StrategySchema).parse(
    await getItemWithAuthorization(url, instance.authorize)
  );
}

export async function getStrategy(
  instance: MondoInstance,
  id: string
): Promise<Strategy> {
  return StrategySchema.parse(
    await getItemWithAuthorization(
      new URL(StrategyResources.buildItemPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function insertStrategy(
  instance: MondoInstance,
  item: InsertStrategyInput
): Promise<Strategy> {
  return StrategySchema.parse(
    await postItemWithAuthorization(
      new URL(StrategyResources.buildPath(), instance.baseUrl),
      instance.authorize,
      InsertStrategyPayloadSchema.parse(item)
    )
  );
}

export async function updateStrategy(
  instance: MondoInstance,
  id: string,
  item: UpdateStrategyInput
): Promise<Strategy> {
  return StrategySchema.parse(
    await patchItemWithAuthorization(
      new URL(StrategyResources.buildItemPath(id), instance.baseUrl),
      instance.authorize,
      UpdateStrategyPayloadSchema.parse(item)
    )
  );
}

export async function deleteStrategy(
  instance: MondoInstance,
  id: string
): Promise<Strategy> {
  return StrategySchema.parse(
    await deleteItemWithAuthorization(
      new URL(StrategyResources.buildItemPath(id), instance.baseUrl),
      instance.authorize
    )
  );
}
