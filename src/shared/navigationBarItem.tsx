import type { Child } from "hono/jsx";

type NavigationBarItemProps =
  | Readonly<{
      type: "link";
      label: string;
      url: string;
      currentPath: string;
    }>
  | Readonly<{
      type: "generic";
      children?: Child;
    }>;

export function NavigationBarItem(props: NavigationBarItemProps) {
  switch (props.type) {
    case "link":
      return props.url === props.currentPath ? null : (
        <li>
          <a href={props.url}>{props.label}</a>
        </li>
      );
    case "generic":
      return props.children !== null && props.children !== undefined ? (
        <li>{props.children}</li>
      ) : null;
    default: {
      const _unknownType: never = props;
      return _unknownType;
    }
  }
}
