import type { MondoIdentity } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  postItemWithAuthorization,
} from '../../common/resources/operations.js';
import { PATH } from '../resources.js';
import {
  type InsertOAuthInput,
  InsertOAuthPayloadSchema,
  type OAuth,
  OAuthSchema,
} from './schema.js';

const RESOURCE = 'oauth';

export class OAuthResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(appId: string): string {
    if (appId?.startsWith(PATH)) {
      return appId;
    }

    return [PATH, appId, RESOURCE].filter(Boolean).join('/');
  }

  public getItem(id: string): Promise<OAuth> {
    return getOAuth(this.instance, id);
  }

  public rotateItemSecret(id: string): Promise<OAuth> {
    return rotateOAuthSecret(this.instance, id);
  }
}

export async function getOAuth(
  instance: MondoIdentity,
  appId: string
): Promise<OAuth> {
  return OAuthSchema.parse(
    await getItemWithAuthorization(
      new URL(OAuthResources.buildPath(appId), instance.config.host),
      instance.authorize
    )
  );
}

export async function rotateOAuthSecret(
  instance: MondoIdentity,
  appId: string,
  item?: InsertOAuthInput
): Promise<OAuth> {
  return OAuthSchema.parse(
    await postItemWithAuthorization(
      new URL(OAuthResources.buildPath(appId), instance.config.host),
      instance.authorize,
      InsertOAuthPayloadSchema.parse(item)
    )
  );
}
