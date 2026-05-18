import { apiRoutes } from "./apiRoutes.ts";
import { pageRoutes } from "./pageRoutes.ts";

export function navigationBar() {
  return (
    <nav>
      <ul>
        <li>
          <a href={pageRoutes.HOME}>Home</a>
        </li>
        <li>
          <a href={pageRoutes.ABOUT}>About</a>
        </li>
        <li>
          <form action={apiRoutes.LOGOUT} method="post">
            <button class="nav-link-button" type="submit">
              Logout
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
