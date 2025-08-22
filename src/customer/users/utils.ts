import type { z } from 'zod';

import type {
  EmailOrPhonePropertiesSchema,
  UpdateUserNamePropertiesSchema,
} from './schema.js';

type UserName = z.input<typeof UpdateUserNamePropertiesSchema>;
type UserEmailOrPhone = z.input<typeof EmailOrPhonePropertiesSchema>;

type User = UserName & UserEmailOrPhone;

export function getInitials(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }

  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('');
}

export function buildName(
  item?: Pick<UserName, 'givenName' | 'familyName'>
): string {
  return [item?.givenName, item?.familyName].filter(Boolean).join(' ');
}

export function buildProperName(
  item?: Pick<
    UserName,
    | 'givenName'
    | 'middleName'
    | 'familyName'
    | 'honorificPrefix'
    | 'honorificSuffix'
  >,
  includeMiddleName = false
): string {
  return [
    item?.honorificPrefix,
    item?.givenName,
    includeMiddleName ? item?.middleName : undefined,
    item?.familyName,
    item?.honorificSuffix,
  ]
    .filter(Boolean)
    .join(' ');
}

export function buildReference(
  item?: Pick<User, 'givenName' | 'familyName' | 'email'>
): string {
  return buildName(item) || item?.email || '';
}
