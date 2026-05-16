import { pingApi } from "@features/ping/pingApi.ts";
import { apiRoutes } from "@shared/apiRoutes.ts";
import { appConfig } from "@shared/appConfig.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { systemClock } from "@shared/clock.ts";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { Hono } from "hono";

const app = new Hono<{ Variables: AppVariables }>()
  // middlewares
  .use("*", createClockMiddleware(systemClock))
  // API routes
  .route(apiRoutes.PING, pingApi);

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
