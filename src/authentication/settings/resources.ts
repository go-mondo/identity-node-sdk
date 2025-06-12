import type { MondoIdentity } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  insertItemWithAuthorization,
} from '../../common/resources/operations.js';
import { parseEgressSchema } from '../../common/resources/utils.js';
import { PATH } from '../resources.js';
import {
  type Settings,
  SettingsSchema,
  type UpsertSettingsInput,
  UpsertSettingsPayloadSchema,
} from './schema.js';

const RESOURCE = 'settings';

export class SettingsResources {
  public constructor(private readonly instance: MondoIdentity) {}

  static buildPath(): string {
    return [PATH, RESOURCE].filter(Boolean).join('/');
  }

  public getItem(): Promise<Settings> {
    return getSettings(this.instance);
  }

  public upsertItem(item: UpsertSettingsInput): Promise<Settings> {
    return upsertSettings(this.instance, item);
  }
}

export async function getSettings(instance: MondoIdentity): Promise<Settings> {
  return parseEgressSchema(
    SettingsSchema(
      await getItemWithAuthorization(
        new URL(SettingsResources.buildPath(), instance.config.host),
        instance.authorizer
      )
    )
  );
}

export async function upsertSettings(
  instance: MondoIdentity,
  item: UpsertSettingsInput
): Promise<Settings> {
  return parseEgressSchema(
    SettingsSchema(
      await insertItemWithAuthorization(
        new URL(SettingsResources.buildPath(), instance.config.host),
        instance.authorizer,
        parseEgressSchema(
          UpsertSettingsPayloadSchema.onUndeclaredKey('delete')(item)
        )
      )
    )
  );
}
