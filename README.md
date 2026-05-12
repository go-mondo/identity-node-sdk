# Mondo Identity Node SDK

TypeScript SDK for working with the Mondo Identity API from Node.js. The SDK
provides a configured API instance, typed resource helpers, runtime validation
with Zod, and exported schemas for common Mondo Identity objects.

> This package is currently published as a beta. Public APIs may continue to
> evolve before a stable `1.0.0` release.

## Requirements

- Node.js 20 or newer
- A Mondo Identity access token

## Installation

```sh
npm install @go-mondo/identity-sdk
```

```sh
pnpm add @go-mondo/identity-sdk
```

```sh
yarn add @go-mondo/identity-sdk
```

## Quick Start

```ts
import MondoIdentity, {
  HttpError,
  ValidationError,
} from '@go-mondo/identity-sdk';
import { insertUser, listUsers } from '@go-mondo/identity-sdk/customer';

const mondo = new MondoIdentity({
  accessToken: process.env.MONDO_ACCESS_TOKEN!,
});

try {
  const user = await insertUser(mondo, {
    givenName: 'Ada',
    familyName: 'Lovelace',
    verifiedEmail: 'ada@example.com',
  });

  console.log(user.id);

  const users = await listUsers(mondo, {
    pageSize: 25,
  });

  console.log(users.items);
  console.log(users.pagination?.nextToken);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.fields);
  } else if (error instanceof HttpError) {
    console.error(error.statusCode, error.type, error.message);
  } else {
    throw error;
  }
}
```

## Configuration

Create a reusable `MondoIdentity` instance and pass it to resource functions.

```ts
import MondoIdentity from '@go-mondo/identity-sdk';

const mondo = new MondoIdentity({
  accessToken: 'access-token',
});
```

By default, requests are sent to `https://api.mondoidentity.com`. Override the
host for tests or private environments:

```ts
const mondo = new MondoIdentity({
  host: 'https://api.example.com',
  accessToken: 'access-token',
});
```

`accessToken` can also be a provider function. When an API request receives a
`401` or `403`, the SDK retries once with `refresh: true`.

```ts
const mondo = new MondoIdentity({
  accessToken: async ({ refresh } = {}) => {
    const token = refresh ? await refreshToken() : await getCachedToken();

    return {
      accessToken: token.value,
      expiresAt: token.expiresAt,
      scope: token.scope,
      type: 'Bearer',
    };
  },
});
```

## Resource Helpers

Most API helpers are exported as functions from domain subpaths. Each helper
accepts a configured `MondoIdentity` instance as its first argument.

```ts
import { listApps, insertApp } from '@go-mondo/identity-sdk/app';

const app = await insertApp(mondo, {
  label: 'Portal',
  description: 'Customer portal',
});

const apps = await listApps(mondo, { pageSize: 10 });
```

Resource classes are also exported for code that prefers grouping operations:

```ts
import { UserResources } from '@go-mondo/identity-sdk/customer';

const users = new UserResources(mondo);
const page = await users.listItems({ pageSize: 25 });
```

## Modules

| Import path | Includes |
| --- | --- |
| `@go-mondo/identity-sdk` | `MondoIdentity`, common schemas, HTTP errors, authorization types |
| `@go-mondo/identity-sdk/action` | action payload schemas |
| `@go-mondo/identity-sdk/activity` | activity listing helpers and activity schemas |
| `@go-mondo/identity-sdk/app` | app CRUD, app authorization, OAuth, OIDC, registration, SAML, app schemas |
| `@go-mondo/identity-sdk/association` | association list, upsert, delete helpers and schemas |
| `@go-mondo/identity-sdk/authentication` | sessions, settings, strategies, factors, providers, authentication schemas |
| `@go-mondo/identity-sdk/authorization` | roles, permissions, authorization schemas |
| `@go-mondo/identity-sdk/customer` | users, organizations, customer schemas and user utilities |
| `@go-mondo/identity-sdk/identity` | identity identifier schemas |
| `@go-mondo/identity-sdk/oauth` | OAuth and OIDC request/response schemas |
| `@go-mondo/identity-sdk/workspace` | workspace authorization, branding, membership, registration, settings, tenant, user schemas |

## Common Operations

### Users

```ts
import {
  deleteUser,
  getUser,
  insertUser,
  listUsers,
  updateUser,
} from '@go-mondo/identity-sdk/customer';

const created = await insertUser(mondo, {
  verifiedEmail: 'grace@example.com',
  givenName: 'Grace',
  familyName: 'Hopper',
});

const user = await getUser(mondo, created.id);

await updateUser(mondo, user.id, {
  familyName: 'Murray Hopper',
});

await deleteUser(mondo, user.id);

const page = await listUsers(mondo, {
  pageSize: 50,
});
```

### Apps

```ts
import {
  getApp,
  insertApp,
  listApps,
  updateApp,
} from '@go-mondo/identity-sdk/app';

const app = await insertApp(mondo, {
  label: 'Admin Console',
});

await updateApp(mondo, app.id, {
  description: 'Internal administration app',
});

const sameApp = await getApp(mondo, app.id);
const apps = await listApps(mondo, { pageSize: 25 });
```

### Authorization

```ts
import {
  insertPermission,
  insertRole,
  listPermissions,
  listRoles,
} from '@go-mondo/identity-sdk/authorization';

const permission = await insertPermission(mondo, {
  name: 'Read users',
  description: 'Read customer user records',
});

const role = await insertRole(mondo, {
  name: 'Support',
  description: 'Customer support access',
});

const permissions = await listPermissions(mondo);
const roles = await listRoles(mondo);
```

### Authentication

```ts
import {
  deleteSession,
  getSettings,
  listSessions,
  upsertSettings,
} from '@go-mondo/identity-sdk/authentication';

const sessions = await listSessions(mondo, {
  filter: {
    user: 'usr_...',
  },
});

await deleteSession(mondo, sessions.items[0].id);

const settings = await getSettings(mondo);

await upsertSettings(mondo, {
  metadata: {
    loginExperience: 'default',
  },
});
```

### Associations

```ts
import {
  deleteAssociation,
  listAssociations,
  upsertAssociation,
} from '@go-mondo/identity-sdk/association';

await upsertAssociation(mondo, 'usr_...', 'rol_...', {
  metadata: {
    source: 'admin',
  },
});

const associations = await listAssociations(mondo, 'usr_...', {
  filter: {
    type: 'Role',
  },
});

await deleteAssociation(mondo, 'usr_...', 'rol_...');
```

## Pagination

List helpers accept an optional pagination object:

```ts
const firstPage = await listUsers(mondo, { pageSize: 25 });

if (firstPage.pagination?.nextToken) {
  const nextPage = await listUsers(mondo, {
    pageSize: 25,
    nextToken: firstPage.pagination.nextToken,
  });

  console.log(nextPage.items);
}
```

Paginated responses have the shape:

```ts
type PaginationCollection<T> = {
  items: T[];
  pagination?: {
    pageSize?: number;
    nextToken?: string;
  };
};
```

## Schemas and Types

Schemas and TypeScript types are exported from each module. Use schemas when
you want to validate data before calling the API or parse API-compatible data in
your own code.

```ts
import {
  UserSchema,
  UserStatus,
  type User,
} from '@go-mondo/identity-sdk/customer';

const user: User = UserSchema.parse(payload);

if (user.status === UserStatus.ACTIVE) {
  console.log(user.email);
}
```

The SDK uses Zod internally to validate mutation payloads and API responses.

## Error Handling

API and network failures are normalized to `HttpError`. API validation failures
with field-level errors are represented as `ValidationError`.

```ts
import { HttpError, ValidationError } from '@go-mondo/identity-sdk';
import { getUser } from '@go-mondo/identity-sdk/customer';

try {
  await getUser(mondo, 'usr_...');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.fields);
  } else if (error instanceof HttpError) {
    console.error({
      statusCode: error.statusCode,
      type: error.type,
      isAuthorizationError: error.isAuthorizationError,
    });
  } else {
    throw error;
  }
}
```

## Development

Install dependencies:

```sh
pnpm install
```

Run checks:

```sh
pnpm run check-types
pnpm run lint
pnpm test
```

Build CommonJS and ESM outputs:

```sh
pnpm run build
```

Format code:

```sh
pnpm run format:fix
```

## License

MIT
