# todo-app

## Development Environment

### 1Password
1Password is used for managing secrets for the application: [Secrets](https://www.1password.dev/cli/use-cases#secrets)

### Setup

Use the 1Password script to create a PowerShell session and source the environment variables
from the `.environment` file.

```sh
op run --no-masking --env-file=.\.environment -- pwsh
```

## Scripts

### TypeScript Type Check

```sh
bun run ts:check
```

### Linting & Formatting

```sh
bun run biome:check
```

```sh
bun run biome:fix
```

