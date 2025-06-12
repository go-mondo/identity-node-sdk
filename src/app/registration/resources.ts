import type { MondoIdentity } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  insertItemWithAuthorization,
} from '../../common/resources/operations.js';
import { parseEgressSchema } from '../../common/resources/utils.js';
import { PATH } from '../resources.js';
import {
  type Registration,
  RegistrationSchema,
  type UpsertRegistrationInput,
  UpsertRegistrationPayloadSchema,
} from './schema.js';

const RESOURCE = 'registration';

export class RegistrationResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(id: string): string {
    if (id?.startsWith(PATH)) {
      return id;
    }

    return [PATH, id, RESOURCE].filter(Boolean).join('/');
  }

  public getItem(id: string): Promise<Registration> {
    return getRegistration(this.instance, id);
  }

  public upsertItem(
    id: string,
    item: UpsertRegistrationInput
  ): Promise<Registration> {
    return upsertRegistration(this.instance, id, item);
  }
}

export async function getRegistration(
  instance: MondoIdentity,
  id: string
): Promise<Registration> {
  return parseEgressSchema(
    RegistrationSchema(
      await getItemWithAuthorization(
        new URL(RegistrationResources.buildPath(id), instance.config.host),
        instance.authorizer
      )
    )
  );
}

export async function upsertRegistration(
  instance: MondoIdentity,
  id: string,
  item: UpsertRegistrationInput
): Promise<Registration> {
  return parseEgressSchema(
    RegistrationSchema(
      await insertItemWithAuthorization(
        new URL(RegistrationResources.buildPath(id), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpsertRegistrationPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}
