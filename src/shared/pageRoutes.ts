import { aboutPage } from "@features/about/aboutPage";
import { addToDoPage } from "@features/add-todo/addToDoPage.tsx";
import { homePage } from "@features/home/homePage.tsx";
import { loginPage } from "@features/login/loginPage.tsx";
import type {
  AppVariables,
  AuthenticatedAppVariables,
} from "@shared/appVariables.ts";
import { jwtPayloadSchema } from "@shared/authentication.ts";
import { pageRoutes } from "@shared/routes.ts";
import { Hono, type MiddlewareHandler } from "hono";

export function createAuthenticatedPageRoutes(jwt: MiddlewareHandler) {
  return new Hono<{
    Variables: AuthenticatedAppVariables;
  }>()
    .use("/auth/*", async (c, next) => {
      try {
        await jwt(c, async () => {});
        const validatedJwtPayload = jwtPayloadSchema.parse(c.var.jwtPayload);
        c.set("validatedJwtPayload", validatedJwtPayload);
      } catch {
        return c.redirect(pageRoutes.LOGIN);
      }

      await next();
      return;
    })
    .route("/auth/about", aboutPage)
    .route("/auth/home", homePage)
    .route("/auth/add-todo", addToDoPage);
}

export function createPageRoutes() {
  return new Hono<{
    Variables: AppVariables;
  }>().route("/login", loginPage);
}
