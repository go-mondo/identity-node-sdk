import type { MondoIdentity } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  insertItemWithAuthorization,
  updateItemWithAuthorization,
} from '../../common/resources/operations.js';
import { parseEgressSchema } from '../../common/resources/utils.js';
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
  public constructor(private readonly instance: MondoIdentity) {}

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
  instance: MondoIdentity,
  appId: string
): Promise<OIDC> {
  return parseEgressSchema(
    OIDCSchema(
      await getItemWithAuthorization(
        new URL(OIDCResources.buildPath(appId), instance.config.host),
        instance.authorizer
      )
    )
  );
}

export async function insertOIDC(
  instance: MondoIdentity,
  appId: string,
  item?: InsertOIDCInput
): Promise<OIDC> {
  return parseEgressSchema(
    OIDCSchema(
      await insertItemWithAuthorization(
        new URL(OIDCResources.buildPath(appId), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          InsertOIDCPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}

export async function updateOIDC(
  instance: MondoIdentity,
  appId: string,
  item: UpdateOIDCInput
): Promise<OIDC> {
  return parseEgressSchema(
    OIDCSchema(
      await updateItemWithAuthorization(
        new URL(OIDCResources.buildPath(appId), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpdateOIDCPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}

export async function deleteOIDC(
  instance: MondoIdentity,
  appId: string
): Promise<OIDC> {
  return parseEgressSchema(
    OIDCSchema(
      await deleteItemWithAuthorization(
        new URL(OIDCResources.buildPath(appId), instance.config.host),
        instance.authorizer
      )
    )
  );
}
