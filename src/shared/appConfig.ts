import z from "zod";

const environmentVariablesSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.string().optional().default("development"),
});

export type AppConfig = Readonly<{
  port: number;
  environment: string;
  jwt: {
    secret: string;
    cookieName: string;
  };
}>;

export function createAppConfig(
  processEnv: Record<string, string | undefined>,
): AppConfig {
  const environmentVariables = environmentVariablesSchema.parse(processEnv);
  return {
    port: environmentVariables.PORT,
    environment: environmentVariables.NODE_ENV,
    jwt: {
      secret: environmentVariables.JWT_SECRET,
      cookieName: "todo-app",
    },
  };
}
