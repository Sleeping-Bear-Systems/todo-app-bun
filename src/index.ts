import { Hono } from "hono";
import { pingApi } from "./feature/pingApi.ts";
import { apiRoutes } from "./shared/apiRoutes.ts";
import { appConfig } from "./shared/appConfig.ts";

const app = new Hono()
  // API routes
  .route(apiRoutes.PING, pingApi);

export default {
  port: appConfig.port,
  fetch: app.fetch,
};
