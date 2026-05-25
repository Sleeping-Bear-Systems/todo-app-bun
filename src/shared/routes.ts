/**
 * API routes.
 */
export const apiRoutes = {
  LOGIN: "/api/login",
  LOGOUT: "/api/logout",
  PING: "/api/ping",
  ADD_TODO: "/api/auth/add-todo",
} as const;

/**
 * Page routes.
 */
export const pageRoutes = {
  HOME: "/auth/home",
  ABOUT: "/auth/about",
  LOGIN: "/login",
  ADD_TODO: "/auth/add-todo",
} as const;
