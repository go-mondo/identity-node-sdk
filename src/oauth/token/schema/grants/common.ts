import { AppIdSchema } from 'src/app';
import * as z from 'zod/v4';

export const ClientRequestSchema = z.object({
  /**
   * REQUIRED. The client identifier.
   * NOTE: This is only required in the body if the client is NOT authenticating
   * via the HTTP "Authorization" header (Basic Auth).
   */
  client_id: AppIdSchema.describe('The Client ID.'),

  /**
   * REQUIRED. The client secret.
   * NOTE: This is only required in the body if the client is NOT authenticating
   * via the HTTP "Authorization" header (Basic Auth).
   */
  client_secret: z.string().min(1).describe('The Client Secret.'),
});
