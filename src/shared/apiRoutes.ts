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
import { HTTPException } from "hono/http-exception";

export function createAuthenticatedApiRoutes(jwt: MiddlewareHandler) {
  return new Hono<{
    Variables: AuthenticatedAppVariables;
  }>()
    .use("/auth/*", async (c, next) => {
      await jwt(c, async () => {});
      const result = jwtPayloadSchema.safeParse(c.var.jwtPayload);
      if (!result.success) {
        throw new HTTPException(401, { message: "Invalid token" });
      }
      c.set("validatedJwtPayload", result.data);
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
