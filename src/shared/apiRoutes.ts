import { addToDoApi } from "@features/add-todo/addToDoApi.tsx";
import { loginApi } from "@features/login/loginApi.tsx";
import { logoutApi } from "@features/login/logoutApi.ts";
import { pingApi } from "@features/ping/pingApi.ts";
import type {
  AppVariables,
  AuthenticatedAppVariables,
} from "@shared/appVariables.ts";
import { jwtPayloadSchema } from "@shared/authentication.ts";
import { Hono, type MiddlewareHandler } from "hono";

export function createAuthenticatedApiRoutes(jwt: MiddlewareHandler) {
  return new Hono<{
    Variables: AuthenticatedAppVariables;
  }>()
    .use("/auth/*", async (c, next) => {
      await jwt(c, async () => {});
      const validatedJwtPayload = jwtPayloadSchema.parse(c.var.jwtPayload);
      c.set("validatedJwtPayload", validatedJwtPayload);
      await next();
    })
    .route("/auth/add-todo", addToDoApi);
}

export function createApiRoutes() {
  return new Hono<{ Variables: AppVariables }>()
    .route("/login", loginApi)
    .route("/logout", logoutApi)
    .route("/ping", pingApi);
}
