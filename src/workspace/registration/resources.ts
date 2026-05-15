import type * as z from 'zod/v4';
import type { MondoInstance } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  patchItemWithAuthorization,
} from '../../common/resources/operations.js';
import {
  type Registration,
  RegistrationSchema,
  UpsertRegistrationPayloadSchema,
} from './schema.js';

const PATH = '/workspace/registration';

export type UpsertRegistrationInput = z.input<
  typeof UpsertRegistrationPayloadSchema
>;

export class RegistrationResources {
  public constructor(private readonly instance: MondoInstance) {}

  static buildPath(): string {
    return PATH;
  }

  public getItem(): Promise<Registration> {
    return getRegistration(this.instance);
  }

  public upsertItem(item: UpsertRegistrationInput): Promise<Registration> {
    return upsertRegistration(this.instance, item);
  }
}

export async function getRegistration(
  instance: MondoInstance
): Promise<Registration> {
  return RegistrationSchema.parse(
    await getItemWithAuthorization(
      new URL(RegistrationResources.buildPath(), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function upsertRegistration(
  instance: MondoInstance,
  item: UpsertRegistrationInput
): Promise<Registration> {
  return RegistrationSchema.parse(
    await patchItemWithAuthorization(
      new URL(RegistrationResources.buildPath(), instance.baseUrl),
      instance.authorize,
      UpsertRegistrationPayloadSchema.parse(item)
    )
  );
}
