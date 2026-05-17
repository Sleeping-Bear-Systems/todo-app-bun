import z from "zod";

const environmentVariablesSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  JWT_SECRET: z.string().min(32),
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
  return {
    port: environmentVariables.PORT,
    jwt: {
      secret: environmentVariables.JWT_SECRET,
      cookie: "todo-app",
    },
  };
}
