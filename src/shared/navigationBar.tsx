import { apiRoutes } from "./apiRoutes.ts";
import { NavigationBarItem } from "./navigationBarItem.tsx";
import { pageRoutes } from "./pageRoutes.ts";

export type SharedNavigationBarProps = Readonly<{
  currentPath: string;
}>;

export type AuthenticatedNavigationBarProps = SharedNavigationBarProps &
  Readonly<{
    type: "authenticated";
    username: string;
  }>;

export type UnauthenticatedNavigationBarProps = SharedNavigationBarProps &
  Readonly<{
    type: "unauthenticated";
  }>;

export type NavigationBarProps =
  | AuthenticatedNavigationBarProps
  | UnauthenticatedNavigationBarProps;

export function NavigationBar(props: NavigationBarProps) {
  switch (props.type) {
    case "authenticated":
      return (
        <nav>
          <ul>
            <NavigationBarItem
              type="link"
              label="Home"
              url={pageRoutes.HOME}
              currentPath={props.currentPath}
            />
            <NavigationBarItem
              type="link"
              label="Add"
              url={pageRoutes.ADD_TODO}
              currentPath={props.currentPath}
            />
            <NavigationBarItem
              type="link"
              label="About"
              url={pageRoutes.ABOUT}
              currentPath={props.currentPath}
            />
            <NavigationBarItem type="generic">
              {props.username}
            </NavigationBarItem>
            <NavigationBarItem type="generic">
              <form action={apiRoutes.LOGOUT} method="post">
                <button class="nav-link-button" type="submit">
                  Logout
                </button>
              </form>
            </NavigationBarItem>
          </ul>
        </nav>
      );
    case "unauthenticated":
      return (
        <nav>
          <ul>
            <NavigationBarItem
              type="link"
              label="Login"
              url={pageRoutes.LOGIN}
              currentPath={props.currentPath}
            />
            <NavigationBarItem
              type="link"
              label="About"
              url={pageRoutes.ABOUT}
              currentPath={props.currentPath}
            />
          </ul>
        </nav>
      );
    default: {
      const _unknownType: never = props;
      return _unknownType;
    }
  }
}
