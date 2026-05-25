import { createAppConfig } from "@shared/appConfig.ts";
import { createAppConfigMiddleware } from "@shared/appConfigMiddleware.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { systemClock } from "@shared/clock.ts";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { createLoggerMiddleware } from "@shared/loggerMiddleware.ts";
import { createStructuredLogger } from "@shared/structuredLogger.ts";
import { addUser } from "@shared/user.ts";
import { randomUUIDv7 } from "bun";
import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import {
  createApiRoutes,
  createAuthenticatedApiRoutes,
} from "./shared/apiRoutes.ts";
import {
  createAuthenticatedPageRoutes,
  createPageRoutes,
} from "./shared/pageRoutes.ts";

// temporary user
// will be removed when IDP is hooked up
await addUser("admin", "password1234");

const appConfig = createAppConfig(Bun.env);

const logger = createStructuredLogger(appConfig);

const jwtMiddleware = jwt({
  secret: appConfig.jwt.secret,
  cookie: appConfig.jwt.cookieName,
  alg: "HS256",
});

logger.info("🚀 Starting application");

const app = new Hono<{ Variables: AppVariables }>()
  // middlewares
  .use(secureHeaders())
  .use(csrf())
  .use("*", createAppConfigMiddleware(appConfig))
  .use("*", createClockMiddleware(systemClock))
  .use("*", createLoggerMiddleware(logger))
  .use("/api/*", cors())
  .use(
    "/api/*",
    requestId({
      generator: (_c: Context) => randomUUIDv7().toString(),
    }),
  )
  // serve static files from public directory
  .use("/*", serveStatic({ root: "./public" }))
  // API routes
  .route("/api", createApiRoutes())
  .route("/api", createAuthenticatedApiRoutes(jwtMiddleware))
  // Page routes
  .get("/", (c) => {
    return c.redirect("/auth");
  })
  .route("/", createPageRoutes())
  .route("/", createAuthenticatedPageRoutes(jwtMiddleware));

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
