# todo-app

## Development Environment

### Setup

Use the `set-dev` script to create a PowerShell session and source the environment variables
from the `.environment` file.

```sh
set-dev -Verbose -LocalEnvFile .\.environment
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
