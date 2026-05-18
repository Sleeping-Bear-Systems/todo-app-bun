import { aboutPage } from "@features/about/aboutPage.tsx";
import { createToDoApi } from "@features/create-todo/createToDoApi";
import { createToDoPage } from "@features/create-todo/createToDoPage";
import { homePage } from "@features/home/homePage.tsx";
import { loginApi } from "@features/login/loginApi.tsx";
import { logoutApi } from "@features/login/logoutApi.ts";
import { pingApi } from "@features/ping/pingApi.ts";
import { apiRoutes } from "@shared/apiRoutes.ts";
import { createAppConfig } from "@shared/appConfig.ts";
import { createAppConfigMiddleware } from "@shared/appConfigMiddleware.ts";
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

const appConfig = createAppConfig(Bun.env);

const app = new Hono<{ Variables: AppVariables }>()
  // middlewares
  .use("*", createAppConfigMiddleware(appConfig))
  .use("*", createClockMiddleware(systemClock))
  // serve static files from public directory
  .use("/*", serveStatic({ root: "./public" }))
  // API routes
  .route(apiRoutes.LOGIN, loginApi)
  .route(apiRoutes.LOGOUT, logoutApi)
  .route(apiRoutes.PING, pingApi)
  .route(apiRoutes.CREATE_TODO, createToDoApi)
  // Page routes
  .route(pageRoutes.ABOUT, aboutPage)
  .route(pageRoutes.CREATE_TODO, createToDoPage)
  .route(pageRoutes.HOME, homePage);

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
