import z from "zod";

const environmentVariablesSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type AppConfig = Readonly<{
  port: number;
  jwt: {
    secret: string;
    cookie: string;
  };
}>;

export function createAppConfig(
  processEnv: Record<string, string | undefined>,
): AppConfig {
  const environmentVariables = environmentVariablesSchema.parse(processEnv);
  const appConfig: AppConfig = {
    port: environmentVariables.PORT,
    jwt: {
      secret: "fake-jwt-secret",
      cookie: "todo-app",
    },
  };
  return appConfig;
}

export const appConfig = createAppConfig(Bun.env);
