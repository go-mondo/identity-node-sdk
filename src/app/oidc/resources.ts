import type { MondoInstance } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  patchItemWithAuthorization,
  postItemWithAuthorization,
} from '../../common/resources/operations.js';
import { PATH } from '../resources.js';
import {
  type InsertOIDCInput,
  InsertOIDCPayloadSchema,
  type OIDC,
  OIDCSchema,
  type UpdateOIDCInput,
  UpdateOIDCPayloadSchema,
} from './schema.js';

const RESOURCE = 'oidc';

export class OIDCResources {
  public constructor(private readonly instance: MondoInstance) {}

  static buildPath(appId: string): string {
    if (appId?.startsWith(PATH)) {
      return appId;
    }

    return [PATH, appId, RESOURCE].filter(Boolean).join('/');
  }

  public getItem(appId: string): Promise<OIDC> {
    return getOIDC(this.instance, appId);
  }

  public insertItem(appId: string, item?: InsertOIDCInput): Promise<OIDC> {
    return insertOIDC(this.instance, appId, item);
  }

  public updateItem(appId: string, item: UpdateOIDCInput): Promise<OIDC> {
    return updateOIDC(this.instance, appId, item);
  }

  public deleteItem(appId: string): Promise<OIDC> {
    return deleteOIDC(this.instance, appId);
  }
}

export async function getOIDC(
  instance: MondoInstance,
  appId: string
): Promise<OIDC> {
  return OIDCSchema.parse(
    await getItemWithAuthorization(
      new URL(OIDCResources.buildPath(appId), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function insertOIDC(
  instance: MondoInstance,
  appId: string,
  item?: InsertOIDCInput
): Promise<OIDC> {
  return OIDCSchema.parse(
    await postItemWithAuthorization(
      new URL(OIDCResources.buildPath(appId), instance.baseUrl),
      instance.authorize,
      item ? InsertOIDCPayloadSchema.parse(item) : undefined
    )
  );
}

export async function updateOIDC(
  instance: MondoInstance,
  appId: string,
  item: UpdateOIDCInput
): Promise<OIDC> {
  return OIDCSchema.parse(
    await patchItemWithAuthorization(
      new URL(OIDCResources.buildPath(appId), instance.baseUrl),
      instance.authorize,
      UpdateOIDCPayloadSchema.parse(item)
    )
  );
}

export async function deleteOIDC(
  instance: MondoInstance,
  appId: string
): Promise<OIDC> {
  return OIDCSchema.parse(
    await deleteItemWithAuthorization(
      new URL(OIDCResources.buildPath(appId), instance.baseUrl),
      instance.authorize
    )
  );
}
