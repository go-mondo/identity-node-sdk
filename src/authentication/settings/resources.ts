import type { MondoInstance } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  postItemWithAuthorization,
} from '../../common/resources/operations.js';
import { PATH } from '../resources.js';
import {
  type Settings,
  SettingsSchema,
  type UpsertSettingsInput,
  UpsertSettingsPayloadSchema,
} from './schema.js';

const RESOURCE = 'settings';

export class SettingsResources {
  public constructor(private readonly instance: MondoInstance) {}

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

export async function getSettings(instance: MondoInstance): Promise<Settings> {
  return SettingsSchema.parse(
    await getItemWithAuthorization(
      new URL(SettingsResources.buildPath(), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function upsertSettings(
  instance: MondoInstance,
  item: UpsertSettingsInput
): Promise<Settings> {
  return SettingsSchema.parse(
    await postItemWithAuthorization(
      new URL(SettingsResources.buildPath(), instance.baseUrl),
      instance.authorize,
      UpsertSettingsPayloadSchema.parse(item)
    )
  );
}
