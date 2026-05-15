import type * as z from 'zod/v4';
import type { MondoInstance } from '../../common/resources/init.js';
import {
  getItemWithAuthorization,
  patchItemWithAuthorization,
} from '../../common/resources/operations.js';
import {
  type Branding,
  BrandingSchema,
  UpsertBrandingPayloadSchema,
} from './schema.js';

const PATH = '/workspace/branding';

export type UpsertBrandingInput = z.input<typeof UpsertBrandingPayloadSchema>;

export class BrandingResources {
  public constructor(private readonly instance: MondoInstance) {}

  static buildPath(): string {
    return PATH;
  }

  public getItem(): Promise<Branding> {
    return getBranding(this.instance);
  }

  public upsertItem(item: UpsertBrandingInput): Promise<Branding> {
    return upsertBranding(this.instance, item);
  }
}

export async function getBranding(instance: MondoInstance): Promise<Branding> {
  return BrandingSchema.parse(
    await getItemWithAuthorization(
      new URL(BrandingResources.buildPath(), instance.baseUrl),
      instance.authorize
    )
  );
}

export async function upsertBranding(
  instance: MondoInstance,
  item: UpsertBrandingInput
): Promise<Branding> {
  return BrandingSchema.parse(
    await patchItemWithAuthorization(
      new URL(BrandingResources.buildPath(), instance.baseUrl),
      instance.authorize,
      UpsertBrandingPayloadSchema.parse(item)
    )
  );
}
