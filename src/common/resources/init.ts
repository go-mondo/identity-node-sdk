import * as z from 'zod/v4';
import {
  type AccessTokenProvider,
  type Authorizer,
  getAccessTokenValue,
} from './authorization.js';

const BaseConfigSchema = z.object({
  host: z
    .url()
    .default('https://api.mondoidentity.com')
    .pipe(z.transform((v) => new URL(v))),
});

const AccessTokenConfigSchema = z.object({
  ...BaseConfigSchema.shape,
  accessToken: z.union([
    z.string().min(1),
    z.custom<AccessTokenProvider>((value) => typeof value === 'function', {
      error: 'Access token must be a string or token provider function',
    }),
  ]),
});

const ConfigSchema = AccessTokenConfigSchema;

export type ConfigProps = z.input<typeof ConfigSchema>;
export type Config = z.output<typeof ConfigSchema>;

/**
 * Interface representing a configured Mondo SDK instance.
 * Provides the base URL and authorization function for API requests.
 */
export type MondoInstance = {
  /** The base URL for API requests */
  readonly baseUrl: URL;
  /** Function that adds authorization headers to requests */
  readonly authorize: Authorizer;
};

/**
 * Type guard to check if a value is a MondoInstance.
 * @param value - The value to check
 * @returns True if the value is a MondoInstance
 */
export function isMondoInstance(value: unknown): value is MondoInstance {
  const maybeInstance = value as Partial<MondoInstance> | null;

  return (
    maybeInstance !== null &&
    typeof maybeInstance === 'object' &&
    maybeInstance.baseUrl instanceof URL &&
    typeof maybeInstance.authorize === 'function'
  );
}

export class MondoIdentity implements MondoInstance {
  readonly config: Config;
  public readonly authorize: Authorizer;

  public constructor(config: ConfigProps) {
    this.config = initConfig(config);
    this.authorize = async (request, options) => {
      const accessToken =
        typeof this.config.accessToken === 'function'
          ? await this.config.accessToken(options)
          : this.config.accessToken;

      request.headers = new Headers(request.headers);
      request.headers.set('authorization', getAccessTokenValue(accessToken));
      return request;
    };
  }

  /** The base URL for API requests. */
  public get baseUrl(): URL {
    return this.config.host;
  }
}

function initConfig(config: ConfigProps): Config {
  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid configuration: ${error.message}`);
    }
    throw error;
  }
}
