import { type } from 'arktype';

export const IdentityIdentifier = {
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
} as const;

export type AnyIdentityIdentifier =
  (typeof IdentityIdentifier)[keyof typeof IdentityIdentifier];

export const IdentityIdentifierSchema = type.enumerated(
  IdentityIdentifier.EMAIL,
  IdentityIdentifier.PHONE_NUMBER
);
