import type { MondoInstance } from '../../common/resources/init.js';
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
  public constructor(private readonly instance: MondoInstance) {}

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
  instance: MondoInstance,
  appId: string
): Promise<OAuth> {
  return OAuthSchema.parse(
    await getItemWithAuthorization(
      new URL(OAuthResources.buildPath(appId), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function rotateOAuthSecret(
  instance: MondoInstance,
  appId: string,
  item?: InsertOAuthInput
): Promise<OAuth> {
  return OAuthSchema.parse(
    await postItemWithAuthorization(
      new URL(OAuthResources.buildPath(appId), instance.baseUrl),
      instance.authorize,
      InsertOAuthPayloadSchema.parse(item)
    )
  );
}
