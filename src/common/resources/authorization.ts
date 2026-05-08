export type AuthorizeOptions = {
  /** Force a credential refresh before authorizing the request. */
  refresh?: boolean;
};

export type AccessToken =
  | string
  | {
      accessToken: string;
      expiresAt?: number;
      scope?: string;
      type?: string;
    };

export type AccessTokenProvider = (
  options?: AuthorizeOptions
) => AccessToken | Promise<AccessToken>;

/**
 * Authorizer function type that adds authentication to requests.
 * Takes a RequestInit object and returns it with authorization headers added.
 * Async authorization can refresh credentials before the outbound API request.
 */
export type Authorizer = (
  request: RequestInit,
  options?: AuthorizeOptions
) => RequestInit | Promise<RequestInit>;

export function getAccessTokenValue(accessToken: AccessToken): string {
  return typeof accessToken === 'string'
    ? accessToken
    : accessToken.accessToken;
}
