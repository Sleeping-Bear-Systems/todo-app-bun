import { apiRoutes } from "@shared/apiRoutes.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { Hono } from "hono";

export const loginPage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page>
        <h1>Login</h1>
        <form id="login">
          <div>
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              data-bind-username
              autocomplete="username"
              required
            />
          </div>
          <div>
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              data-bind-password
              autocomplete="current-password"
              required
            />
          </div>
          <button
            type="button"
            data-on:click={`@post('${apiRoutes.LOGIN}', {contentType: 'form'})`}
          >
            Login
          </button>
        </form>
      </Page>,
    );
  },
);
