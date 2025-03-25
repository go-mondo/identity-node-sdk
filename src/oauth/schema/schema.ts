export const GrantType = {
  CLIENT_CREDENTIALS: 'client_credentials',
  AUTHORIZATION_CODE: 'authorization_code',
  IMPLICIT: 'implicit',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export type AnyGrantType = (typeof GrantType)[keyof typeof GrantType];
