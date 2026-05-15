import type * as z from 'zod/v4';
import type { MondoInstance } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  patchItemWithAuthorization,
} from '../../common/resources/operations.js';
import {
  type Authorization,
  AuthorizationSchema,
  UpsertAuthorizationPayloadSchema,
} from './schema.js';

const PATH = '/v1/workspace/authorization';

export type UpsertAuthorizationInput = z.input<
  typeof UpsertAuthorizationPayloadSchema
>;

export class AuthorizationResources {
  public constructor(private readonly instance: MondoInstance) {}

  static buildPath(): string {
    return PATH;
  }

  public getItem(): Promise<Authorization> {
    return getAuthorization(this.instance);
  }

  public upsertItem(item: UpsertAuthorizationInput): Promise<Authorization> {
    return upsertAuthorization(this.instance, item);
  }
}

export async function getAuthorization(
  instance: MondoInstance
): Promise<Authorization> {
  return AuthorizationSchema.parse(
    await getItemWithAuthorization(
      new URL(AuthorizationResources.buildPath(), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function upsertAuthorization(
  instance: MondoInstance,
  item: UpsertAuthorizationInput
): Promise<Authorization> {
  return AuthorizationSchema.parse(
    await patchItemWithAuthorization(
      new URL(AuthorizationResources.buildPath(), instance.baseUrl),
      instance.authorize,
      UpsertAuthorizationPayloadSchema.parse(item)
    )
  );
}
