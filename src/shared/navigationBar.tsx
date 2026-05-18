import { pageRoutes } from "@shared/pageRoutes.ts";

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
      </ul>
    </nav>
  );
}
