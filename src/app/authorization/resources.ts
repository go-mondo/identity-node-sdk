import type { MondoIdentity } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  putItemWithAuthorization,
} from '../../common/resources/operations.js';
import { PATH } from '../resources.js';
import {
  type Authorization,
  AuthorizationSchema,
  type UpsertAuthorizationInput,
  UpsertAuthorizationPayloadSchema,
} from './schema.js';

const RESOURCE = 'authorization';

export class AuthorizationResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(appId: string): string {
    return [PATH, appId, RESOURCE].filter(Boolean).join('/');
  }

  public getItem(id: string): Promise<Authorization> {
    return getAuthorization(this.instance, id);
  }

  public upsertItem(
    appId: string,
    item: UpsertAuthorizationInput
  ): Promise<Authorization> {
    return upsertAuthorization(this.instance, appId, item);
  }
}

export async function getAuthorization(
  instance: MondoIdentity,
  appId: string
): Promise<Authorization> {
  return AuthorizationSchema.parse(
    await getItemWithAuthorization(
      new URL(AuthorizationResources.buildPath(appId), instance.config.host),
      instance.authorizer
    )
  );
}

export async function upsertAuthorization(
  instance: MondoIdentity,
  appId: string,
  item: UpsertAuthorizationInput
): Promise<Authorization> {
  return AuthorizationSchema.parse(
    await putItemWithAuthorization(
      new URL(AuthorizationResources.buildPath(appId), instance.config.host),
      instance.authorizer,
      UpsertAuthorizationPayloadSchema.parse(item)
    )
  );
}
