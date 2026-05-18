# todo-app

## Development Environment

### 1Password

1Password is used for managing secrets for the application: [Secrets](https://www.1password.dev/cli/use-cases#secrets)

### Setup

Use the 1Password script to create a PowerShell session and source the environment variables
from the `.environment` file.

```pwsh
op run --no-masking --env-file=.\.environment -- pwsh
```

## Scripts

### TypeScript Type Check

```pwsh
bun run ts:check
```

### Linting & Formatting

```pwsh
bun run biome:check
```

```pwsh
bun run biome:fix
```
