# todo-app-bun

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

### TypeScript Type Checking

Runs `tsc` to check for TypeScript issues.

```pwsh
bun run ts:check
```

### Linting & Formatting

Runs `biome` to check for issues.

```pwsh
bun run biome:check
```

Runs `biome` to check and fix issues.

```pwsh
bun run biome:fix
```

### Verification

Runs the `tsc` and `biome` checks together.

```pwsh
bun run check
```

### Debugging

This script starts the application for debugging using Web Debugging.

```pwsh
bun run debug
```

### Running the Application

Runs the application with hot-reloading.

```pwsh
bun run dev
```

Runs the application.

```pwsh
bun run start
```
