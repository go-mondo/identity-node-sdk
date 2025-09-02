import * as z from 'zod/v4';

export const IdentityIdentifier = {
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
} as const;

export type AnyIdentityIdentifier =
  (typeof IdentityIdentifier)[keyof typeof IdentityIdentifier];

export const IdentityIdentifierSchema = z.enum([
  IdentityIdentifier.EMAIL,
  IdentityIdentifier.PHONE_NUMBER,
] as const);
