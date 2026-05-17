import { aboutPage } from "@features/about/aboutPage.tsx";
import { homePage } from "@features/home/homePage.tsx";
import { pingApi } from "@features/ping/pingApi.ts";
import { apiRoutes } from "@shared/apiRoutes.ts";
import { appConfig } from "@shared/appConfig.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { systemClock } from "@shared/clock.ts";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono<{ Variables: AppVariables }>()
  // middlewares
  .use("*", createClockMiddleware(systemClock))
  // serve static files from public directory
  .use("/*", serveStatic({ root: "./public" }))
  // API routes
  .route(apiRoutes.PING, pingApi)
  // Page routes
  .route(pageRoutes.ABOUT, aboutPage)
  .route(pageRoutes.HOME, homePage);

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
