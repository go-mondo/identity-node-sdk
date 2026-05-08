import type { MondoIdentity } from '../../common/resources/init.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  patchItemWithAuthorization,
  postItemWithAuthorization,
} from '../../common/resources/operations.js';
import { PATH } from '../resources.js';
import {
  type InsertSAMLInput,
  InsertSAMLPayloadSchema,
  type SAML,
  SAMLSchema,
  type UpdateSAMLInput,
  UpdateSAMLPayloadSchema,
} from './schema.js';

const RESOURCE = 'saml';

export class SAMLResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(appId: string): string {
    if (appId?.startsWith(PATH)) {
      return appId;
    }

    return [PATH, appId, RESOURCE].filter(Boolean).join('/');
  }

  public getItem(appId: string): Promise<SAML> {
    return getSAML(this.instance, appId);
  }

  public insertItem(appId: string, item?: InsertSAMLInput): Promise<SAML> {
    return insertSAML(this.instance, appId, item);
  }

  public updateItem(appId: string, item: UpdateSAMLInput): Promise<SAML> {
    return updateSAML(this.instance, appId, item);
  }

  public deleteItem(appId: string): Promise<SAML> {
    return deleteSAML(this.instance, appId);
  }
}

export async function getSAML(
  instance: MondoIdentity,
  appId: string
): Promise<SAML> {
  return SAMLSchema.parse(
    await getItemWithAuthorization(
      new URL(SAMLResources.buildPath(appId), instance.config.host),
      instance.authorize
    )
  );
}

export async function insertSAML(
  instance: MondoIdentity,
  appId: string,
  item?: InsertSAMLInput
): Promise<SAML> {
  return SAMLSchema.parse(
    await postItemWithAuthorization(
      new URL(SAMLResources.buildPath(appId), instance.config.host),
      instance.authorize,
      item ? InsertSAMLPayloadSchema.parse(item) : undefined
    )
  );
}

export async function updateSAML(
  instance: MondoIdentity,
  appId: string,
  item: UpdateSAMLInput
): Promise<SAML> {
  return SAMLSchema.parse(
    await patchItemWithAuthorization(
      new URL(SAMLResources.buildPath(appId), instance.config.host),
      instance.authorize,
      UpdateSAMLPayloadSchema.parse(item)
    )
  );
}

export async function deleteSAML(
  instance: MondoIdentity,
  appId: string
): Promise<SAML> {
  return SAMLSchema.parse(
    await deleteItemWithAuthorization(
      new URL(SAMLResources.buildPath(appId), instance.config.host),
      instance.authorize
    )
  );
}
