import { aboutPage } from "@features/about/aboutPage.tsx";
import { createTaskApi } from "@features/create-task/createTaskApi.tsx";
import { createTaskPage } from "@features/create-task/createTaskPage.tsx";
import { homePage } from "@features/home/homePage.tsx";
import { loginApi } from "@features/login/loginApi.tsx";
import { logoutApi } from "@features/login/logoutApi.ts";
import { pingApi } from "@features/ping/pingApi.ts";
import { apiRoutes } from "@shared/apiRoutes.ts";
import { appConfig } from "@shared/appConfig.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { systemClock } from "@shared/clock.ts";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { addUser } from "@shared/user.ts";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

// temporary user
// will be removed when IDP is hooked up
await addUser("admin", "password1234");

const app = new Hono<{ Variables: AppVariables }>()
  // middlewares
  .use("*", createClockMiddleware(systemClock))
  // serve static files from public directory
  .use("/*", serveStatic({ root: "./public" }))
  // API routes
  .route(apiRoutes.LOGIN, loginApi)
  .route(apiRoutes.LOGOUT, logoutApi)
  .route(apiRoutes.PING, pingApi)
  .route(apiRoutes.CREATE_TASK, createTaskApi)
  // Page routes
  .route(pageRoutes.ABOUT, aboutPage)
  .route(pageRoutes.CREATE_TASK, createTaskPage)
  .route(pageRoutes.HOME, homePage);

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
